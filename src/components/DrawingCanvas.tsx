import React, { useRef, useState, useEffect, useCallback } from "react";
import { BrushType, SymmetryType, StampOption, DrawingAction, ColorOption, TemplateOption, SavedDrawing } from "../types";
import {
  Trash2,
  RotateCcw,
  RotateCw,
  Download,
  Sparkles,
  Smile,
  Share2,
  Eraser,
  X,
  Palette,
  FolderHeart,
  Save,
  BookmarkCheck,
  ZoomIn,
  ZoomOut,
  Hand,
} from "lucide-react";
import { COLORS, TEMPLATES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { ShareDrawingModal } from "./ShareDrawingModal";
import { DrawingHistoryModal } from "./DrawingHistoryModal";
import {
  loadSavedDrawings,
  saveDrawingToHistory,
  deleteDrawingFromHistory,
  renameDrawingInHistory,
  toggleFavoriteInHistory,
  generateCanvasThumbnail,
  saveCanvasDraft,
  loadCanvasDraft,
  clearCanvasDraft,
} from "../utils/drawingStorage";

interface DrawingCanvasProps {
  brushType: BrushType;
  onSetBrushType?: (type: BrushType) => void;
  brushColor: string | null;
  onSetBrushColor?: (color: string | null) => void;
  brushSize: number;
  onSetBrushSize?: (size: number) => void;
  symmetry: SymmetryType;
  onSetSymmetry?: (sym: SymmetryType) => void;
  selectedStamp: StampOption | null;
  onSetSelectedStamp?: (stamp: StampOption | null) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  selectedTemplate?: TemplateOption;
  onSetSelectedTemplate?: (template: TemplateOption) => void;
  selectedTemplateSvg?: string;
  selectedTemplateBg?: string;
  selectedTemplateName?: string;
  isHistoryModalOpen?: boolean;
  onSetIsHistoryModalOpen?: (open: boolean) => void;
  onSavedDrawingsCountChange?: (count: number) => void;
}

export default function DrawingCanvas({
  brushType,
  onSetBrushType,
  brushColor,
  onSetBrushColor,
  brushSize,
  onSetBrushSize,
  symmetry,
  onSetSymmetry,
  selectedStamp,
  onSetSelectedStamp,
  canvasRef,
  selectedTemplate,
  onSetSelectedTemplate,
  selectedTemplateSvg = "",
  selectedTemplateBg = "#ffffff",
  selectedTemplateName = "Masterpiece",
  isHistoryModalOpen: controlledHistoryOpen,
  onSetIsHistoryModalOpen,
  onSavedDrawingsCountChange,
}: DrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<DrawingAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingAction[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [lastDrawingBrush, setLastDrawingBrush] = useState<BrushType>("brush");
  const [showNoColorNotice, setShowNoColorNotice] = useState<boolean>(false);
  
  const activeColorObj = brushColor 
    ? COLORS.find((c) => c.value.toLowerCase() === brushColor.toLowerCase())
    : null;
  
  // Social share modal state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareDataUrl, setShareDataUrl] = useState<string | null>(null);
  const [shareBlob, setShareBlob] = useState<Blob | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState<boolean>(false);

  // Drawing History in Local Storage state
  const [internalHistoryModalOpen, setInternalHistoryModalOpen] = useState<boolean>(false);
  const isHistoryModalOpen = controlledHistoryOpen !== undefined ? controlledHistoryOpen : internalHistoryModalOpen;
  const setIsHistoryModalOpen = (open: boolean) => {
    if (onSetIsHistoryModalOpen) {
      onSetIsHistoryModalOpen(open);
    } else {
      setInternalHistoryModalOpen(open);
    }
  };

  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>(() => loadSavedDrawings());
  const [activeDrawingId, setActiveDrawingId] = useState<string | null>(null);
  const [activeDrawingTitle, setActiveDrawingTitle] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasRestoredDraftRef = useRef<boolean>(false);

  // Simple Kid-Friendly Zoom & Pan Tool State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const zoomWrapperRef = useRef<HTMLDivElement | null>(null);
  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMultiTouchRef = useRef<boolean>(false);
  const lastTouchDistRef = useRef<number | null>(null);
  const lastTouchCenterRef = useRef<{ x: number; y: number } | null>(null);
  const isSpacePressedRef = useRef<boolean>(false);

  // Spacebar keyboard shortcut to temporarily activate Pan/Move mode on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === "Space" || e.key === " ") &&
        !e.repeat &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        isSpacePressedRef.current = true;
        setIsPanMode(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        isSpacePressedRef.current = false;
        setIsPanMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // When kid switches brush type or picks a color, automatically switch out of pan mode back to paint mode
  useEffect(() => {
    if (isPanMode && !isSpacePressedRef.current) {
      setIsPanMode(false);
    }
  }, [brushType, brushColor]);

  // Clamps pan so kids never lose the canvas off-screen
  const clampPan = useCallback((px: number, py: number, z: number, w: number, h: number) => {
    if (z <= 1) return { x: 0, y: 0 };
    const margin = 80;
    const minX = w - w * z - margin;
    const maxX = margin;
    const minY = h - h * z - margin;
    const maxY = margin;

    return {
      x: Math.min(maxX, Math.max(minX, px)),
      y: Math.min(maxY, Math.max(minY, py)),
    };
  }, []);

  // Smooth kid-friendly zoom adjustment centered on screen or focal point
  const updateZoom = useCallback(
    (newZoom: number, focalPoint?: { clientX: number; clientY: number }) => {
      const container = containerRef.current;
      if (!container) return;
      const clampedZoom = Math.min(4, Math.max(1, Math.round(newZoom * 100) / 100));

      if (clampedZoom <= 1.01) {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIsPanMode(false);
        return;
      }

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const fx = focalPoint ? focalPoint.clientX - rect.left : w / 2;
      const fy = focalPoint ? focalPoint.clientY - rect.top : h / 2;

      const canvasX = (fx - pan.x) / zoom;
      const canvasY = (fy - pan.y) / zoom;

      const targetPanX = fx - canvasX * clampedZoom;
      const targetPanY = fy - canvasY * clampedZoom;

      const clampedPan = clampPan(targetPanX, targetPanY, clampedZoom, w, h);

      setZoom(clampedZoom);
      setPan(clampedPan);
    },
    [pan, zoom, clampPan]
  );

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsPanMode(false);
  }, []);

  // Ctrl+wheel or trackpad pinch zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || isPanMode) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      updateZoom(zoom + delta, { clientX: e.clientX, clientY: e.clientY });
    }
  };

  // Sync count to parent whenever drawings change
  useEffect(() => {
    if (onSavedDrawingsCountChange) {
      onSavedDrawingsCountChange(savedDrawings.length);
    }
  }, [savedDrawings.length, onSavedDrawingsCountChange]);

  // Auto-restore canvas draft from localStorage on initial load
  useEffect(() => {
    if (hasRestoredDraftRef.current) return;
    hasRestoredDraftRef.current = true;

    try {
      const draft = loadCanvasDraft();
      if (draft && draft.actions && draft.actions.length > 0) {
        setHistory(draft.actions);
        if (onSetSelectedTemplate && draft.templateId) {
          const match = TEMPLATES.find((t) => t.id === draft.templateId);
          if (match) onSetSelectedTemplate(match);
        }
        // Small delay to allow canvas element to measure and initialize
        setTimeout(() => {
          redrawSequence(draft.actions);
          showToast("✨ Restored in-progress drawing from local memory!");
        }, 260);
      }
    } catch (err) {
      console.warn("Could not restore canvas draft:", err);
    }
  }, []);

  // Debounced auto-save of current drawing draft into localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (history.length > 0) {
        saveCanvasDraft(history, selectedTemplate?.id || "blank", selectedTemplate?.name);
      } else {
        clearCanvasDraft();
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [history, selectedTemplate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  const handleSaveToHistory = async (customTitle?: string): Promise<SavedDrawing | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    try {
      const { dataUrl } = await generateCompositeCanvas();
      const thumb = dataUrl || generateCanvasThumbnail(canvas);

      const titleToUse =
        customTitle ||
        activeDrawingTitle ||
        (selectedTemplateName && selectedTemplateName !== "Blank Canvas"
          ? `My ${selectedTemplateName} 🎨`
          : `Masterpiece #${savedDrawings.length + 1} ✨`);

      const { drawing, allDrawings } = saveDrawingToHistory({
        id: activeDrawingId || undefined,
        title: titleToUse,
        thumbnail: thumb,
        actions: history,
        templateId: selectedTemplate?.id || "blank",
        templateName: selectedTemplate?.name || selectedTemplateName || "Blank Canvas",
      });

      setSavedDrawings(allDrawings);
      setActiveDrawingId(drawing.id);
      setActiveDrawingTitle(drawing.title);
      showToast(`🏆 Saved "${drawing.title}" to local storage history!`);
      return drawing;
    } catch (err) {
      console.error("Failed to save drawing to history:", err);
      showToast("❌ Could not save to local storage.");
      return null;
    }
  };

  const handleLoadDrawing = (drawing: SavedDrawing) => {
    setActiveDrawingId(drawing.id);
    setActiveDrawingTitle(drawing.title);
    setHistory(drawing.actions);
    setRedoStack([]);

    if (onSetSelectedTemplate && drawing.templateId) {
      const found = TEMPLATES.find((t) => t.id === drawing.templateId);
      if (found) {
        onSetSelectedTemplate(found);
      }
    }

    setTimeout(() => {
      redrawSequence(drawing.actions);
      showToast(`🎨 Loaded "${drawing.title}" onto canvas!`);
    }, 60);

    saveCanvasDraft(drawing.actions, drawing.templateId, drawing.templateName);
  };

  const handleDeleteDrawing = (id: string) => {
    const updated = deleteDrawingFromHistory(id);
    setSavedDrawings(updated);
    if (activeDrawingId === id) {
      setActiveDrawingId(null);
      setActiveDrawingTitle(null);
    }
    showToast("🗑️ Drawing removed from local storage.");
  };

  const handleRenameDrawing = (id: string, newTitle: string) => {
    const updated = renameDrawingInHistory(id, newTitle);
    setSavedDrawings(updated);
    if (activeDrawingId === id) {
      setActiveDrawingTitle(newTitle);
    }
    showToast("✏️ Renamed drawing!");
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteInHistory(id);
    setSavedDrawings(updated);
  };

  const handleStartNewDrawing = () => {
    handleClearCanvas();
    setActiveDrawingId(null);
    setActiveDrawingTitle(null);
    clearCanvasDraft();
    if (onSetSelectedTemplate && TEMPLATES[0]) {
      onSetSelectedTemplate(TEMPLATES[0]);
    }
    showToast("📄 Started a fresh new canvas!");
  };

  const handleImportImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear existing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aspect fit within canvas
        const ratio = Math.min((canvas.width * 0.94) / img.width, (canvas.height * 0.94) / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        ctx.drawImage(img, x, y, w, h);

        const imgTitle = file.name.replace(/\.[^/.]+$/, "").slice(0, 24);
        setActiveDrawingId(null);
        setActiveDrawingTitle(`Image: ${imgTitle}`);
        setHistory([]);
        setRedoStack([]);
        clearCanvasDraft();

        showToast(`🖼️ Opened "${file.name}"! You can draw and paint over it!`);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveButtonClick = async () => {
    if (history.length === 0) {
      showToast("🎨 Draw something on canvas first before saving!");
      return;
    }
    await handleSaveToHistory();
    await handleDownload();
  };
  
  // Track continuous stroke points in real-time
  const currentActionRef = useRef<DrawingAction | null>(null);
  const rainbowHueRef = useRef<number>(0);

  // Resize canvas to fill the modular container grid item
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Save drawing content
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      // Configure high DPI or simple box size
      const rect = container.getBoundingClientRect();
      const newWidth = Math.max(300, Math.floor(rect.width));
      const newHeight = Math.max(250, Math.floor(rect.height));

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Re-fill background canvas clear
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        
        // Restore drawn canvas contents
        ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    // Let container layout stabilize first
    const timer = setTimeout(handleResize, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [canvasRef]);

  // Clears the canvas buffer
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setRedoStack([]);
    setActiveDrawingId(null);
    setActiveDrawingTitle(null);
    clearCanvasDraft();
    handleResetZoom();
  };

  // Undos last action and redraws the sequence from history list
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (!last) return;

    const remaining = history.slice(0, -1);
    setHistory(remaining);
    setRedoStack([last, ...redoStack]);
    redrawSequence(remaining);
  };

  // Redos the action from the redo stack list
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    if (!next) return;

    const updatedHistory = [...history, next];
    setHistory(updatedHistory);
    setRedoStack(redoStack.slice(1));
    redrawSequence(updatedHistory);
  };

  const redrawSequence = (actions: DrawingAction[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render each action onto context
    actions.forEach((action) => {
      if (action.type === "stamp") {
        if (action.stampId && action.stampX !== undefined && action.stampY !== undefined) {
          drawStampOnContext(
            ctx,
            action.stampId,
            action.stampX,
            action.stampY,
            action.size,
            action.symmetry
          );
        }
      } else {
        drawLinesOnContext(ctx, action);
      }
    });
  };

  // Helper drawing functions across symmetry settings
  const drawStampOnContext = (
    ctx: CanvasRenderingContext2D,
    emoji: string,
    x: number,
    y: number,
    size: number,
    sym: SymmetryType
  ) => {
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;

    const coords = getSymmetryCoordinates(x, y, w, h, sym);
    coords.forEach((c) => {
      ctx.save();
      ctx.font = `${size * 4}px Inter, "Segoe UI Emoji"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Minor rotation offset for whimsical look
      ctx.translate(c.x, c.y);
      ctx.fillText(emoji, 0, 0);
      ctx.restore();
    });
  };

  // Helper drawing functions for whimsical magic styles
  const drawSparkleStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    color: string
  ) => {
    ctx.save();
    ctx.beginPath();
    const innerR = radius * 0.22;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const ox = cx + Math.cos(angle) * radius;
      const oy = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);

      const inAngle = angle + Math.PI / 4;
      const ix = cx + Math.cos(inAngle) * innerR;
      const iy = cy + Math.sin(inAngle) * innerR;
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = "#fef08a";
    ctx.shadowBlur = Math.max(3, radius * 0.4);
    ctx.fill();

    // Sparkling white center
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, radius * 0.25), 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fill();
    ctx.restore();
  };

  const drawSoapBubble = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    tintColor: string
  ) => {
    ctx.save();
    // Semi-translucent body
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = tintColor;
    ctx.globalAlpha = 0.22;
    ctx.fill();

    // Delicate rim
    ctx.lineWidth = Math.max(1.2, radius * 0.1);
    ctx.strokeStyle = tintColor;
    ctx.globalAlpha = 0.65;
    ctx.stroke();

    // Top-left curved highlight
    ctx.beginPath();
    ctx.arc(cx - radius * 0.12, cy - radius * 0.12, radius * 0.72, Math.PI * 1.05, Math.PI * 1.55);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = Math.max(1.5, radius * 0.18);
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.9;
    ctx.stroke();

    // Bottom-right tiny sparkle
    ctx.beginPath();
    ctx.arc(cx + radius * 0.42, cy + radius * 0.42, Math.max(1, radius * 0.12), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.globalAlpha = 0.65;
    ctx.fill();
    ctx.restore();
  };

  const CONFETTI_PALETTE = ["#ec4899", "#3b82f6", "#eab308", "#10b981", "#8b5cf6", "#f97316", "#06b6d4"];
  const drawConfettiPiece = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    baseColor: string,
    seed: number
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    const angle = (seed * 57) % 360;
    ctx.rotate((angle * Math.PI) / 180);

    const colors = [baseColor, ...CONFETTI_PALETTE];
    const color = colors[Math.abs(seed) % colors.length]!;
    ctx.fillStyle = color;

    const shapeType = Math.abs(seed) % 3;
    if (shapeType === 0) {
      const w = Math.max(5, size * 0.65);
      const h = Math.max(2.5, size * 0.3);
      ctx.fillRect(-w / 2, -h / 2, w, h);
    } else if (shapeType === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(2.5, size * 0.3), 0, Math.PI * 2);
      ctx.fill();
    } else {
      const r = Math.max(3.5, size * 0.4);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.7, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };

  const drawFlowerBlossom = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    petalColor: string
  ) => {
    ctx.save();
    const flowerRadius = Math.max(6, size * 0.65);
    const petalRadius = flowerRadius * 0.45;
    const petalDist = flowerRadius * 0.55;

    // Tiny cute green leaf
    ctx.save();
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.ellipse(cx + flowerRadius * 0.7, cy + flowerRadius * 0.3, flowerRadius * 0.38, flowerRadius * 0.2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5 Flower Petals
    ctx.fillStyle = petalColor || "#ec4899";
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = cx + Math.cos(angle) * petalDist;
      const py = cy + Math.sin(angle) * petalDist;
      ctx.beginPath();
      ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Golden Center Pistil
    ctx.beginPath();
    ctx.arc(cx, cy, flowerRadius * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = "#facc15";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ca8a04";
    ctx.stroke();
    ctx.restore();
  };

  const drawFluffyCloudPuff = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    color: string
  ) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.22;
    const puffCount = 5;
    for (let k = 0; k < puffCount; k++) {
      const angle = (k * 2 * Math.PI) / puffCount;
      const dist = radius * 0.4;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawLinesOnContext = (ctx: CanvasRenderingContext2D, action: DrawingAction) => {
    if (action.points.length === 0) return;
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;

    // We can compute paths for all symmetrical coordinate duplicates
    const strokeCopiesCount = action.symmetry === "kaleidoscope" ? 4 : action.symmetry === "none" ? 1 : 2;
    
    for (let sIndex = 0; sIndex < strokeCopiesCount; sIndex++) {
      ctx.beginPath();
      
      // Determine coordinates for this copy index
      const getSymPoint = (pt: { x: number; y: number }) => {
        if (action.symmetry === "none") return pt;
        if (action.symmetry === "horizontal") {
          return sIndex === 0 ? pt : { x: w - pt.x, y: pt.y };
        }
        if (action.symmetry === "vertical") {
          return sIndex === 0 ? pt : { x: pt.x, y: h - pt.y };
        }
        // Kaleidoscope
        if (sIndex === 0) return pt;
        if (sIndex === 1) return { x: w - pt.x, y: pt.y };
        if (sIndex === 2) return { x: pt.x, y: h - pt.y };
        return { x: w - pt.x, y: h - pt.y };
      };

      const start = getSymPoint(action.points[0]!);
      ctx.moveTo(start.x, start.y);

      // Custom brush strokes setups
      if (action.type === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = action.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }

      // Handle single tap dot (single point in action)
      if (action.points.length === 1) {
        const p0 = getSymPoint(action.points[0]!);
        if (action.type === "eraser") {
          ctx.beginPath();
          ctx.arc(p0.x, p0.y, Math.max(1, action.size / 2), 0, Math.PI * 2);
          ctx.fill();
        } else if (action.type === "spray") {
          ctx.fillStyle = action.color;
          for (let s = 0; s < 14; s++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * (action.size * 1.2);
            ctx.fillRect(p0.x + Math.cos(angle) * dist, p0.y + Math.sin(angle) * dist, 2.5, 2.5);
          }
        } else if (action.type === "sparkle") {
          drawSparkleStar(ctx, p0.x, p0.y, Math.max(8, action.size * 0.8), action.color);
        } else if (action.type === "bubbles") {
          drawSoapBubble(ctx, p0.x, p0.y, Math.max(6, action.size * 0.6), action.color);
          drawSoapBubble(ctx, p0.x + action.size * 0.35, p0.y - action.size * 0.3, Math.max(4, action.size * 0.4), action.color);
        } else if (action.type === "confetti") {
          for (let c = 0; c < 6; c++) {
            const angle = (c * Math.PI * 2) / 6;
            const dist = action.size * 0.55;
            drawConfettiPiece(ctx, p0.x + Math.cos(angle) * dist, p0.y + Math.sin(angle) * dist, action.size, action.color, c * 37);
          }
        } else if (action.type === "fire") {
          ctx.beginPath();
          ctx.arc(p0.x, p0.y, Math.max(3, action.size * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = "#ea580c";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p0.x, p0.y, Math.max(1.5, action.size * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = "#fef08a";
          ctx.fill();
        } else if (action.type === "flower") {
          drawFlowerBlossom(ctx, p0.x, p0.y, action.size, action.color);
        } else if (action.type === "cloud") {
          drawFluffyCloudPuff(ctx, p0.x, p0.y, Math.max(6, action.size * 0.8), action.color);
        } else {
          ctx.beginPath();
          ctx.arc(p0.x, p0.y, Math.max(1, action.size / 2), 0, Math.PI * 2);
          ctx.fillStyle = action.type === "neon" ? "#ffffff" : action.color;
          ctx.fill();
        }
        continue;
      }

      for (let i = 1; i < action.points.length; i++) {
        const p1 = getSymPoint(action.points[i - 1]!);
        const p2 = getSymPoint(action.points[i]!);

        if (action.type === "brush") {
          ctx.strokeStyle = action.color;
          ctx.lineWidth = action.size;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        } else if (action.type === "crayon") {
          // Draw multiple fine lines with minor jitter coordinates to create organic textured look
          ctx.strokeStyle = action.color;
          ctx.lineWidth = action.size / 3;
          
          for (let j = 0; j < 3; j++) {
            const jitterX = (Math.random() - 0.5) * (action.size * 0.4);
            const jitterY = (Math.random() - 0.5) * (action.size * 0.4);
            ctx.beginPath();
            ctx.moveTo(p1.x + jitterX, p1.y + jitterY);
            ctx.lineTo(p2.x + jitterX, p2.y + jitterY);
            ctx.stroke();
          }
        } else if (action.type === "neon") {
          // Neon glow has outer thick line with low opacity, and center white core line
          ctx.strokeStyle = action.color;
          ctx.lineWidth = action.size * 2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = action.size * 0.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        } else if (action.type === "rainbow") {
          // Modulate rotating rainbow hue color
          const segHue = (action.points[i]?.x ?? 0) % 360;
          ctx.strokeStyle = `hsl(${segHue}, 100%, 55%)`;
          ctx.lineWidth = action.size;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        } else if (action.type === "sparkle") {
          // Soft glowing underlying trace
          ctx.save();
          ctx.strokeStyle = action.color;
          ctx.globalAlpha = 0.4;
          ctx.lineWidth = Math.max(2, action.size * 0.4);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();

          // Sparkle stars and glitter particles along segment
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const step = Math.max(14, action.size * 1.1);
          const count = Math.max(1, Math.floor(dist / step));
          for (let s = 1; s <= count; s++) {
            const t = s / count;
            const sx = p1.x + (p2.x - p1.x) * t;
            const sy = p1.y + (p2.y - p1.y) * t;
            drawSparkleStar(ctx, sx, sy, Math.max(5, action.size * 0.6), action.color);

            // Shimmering micro dust
            ctx.fillStyle = s % 2 === 0 ? "#fef08a" : "#ffffff";
            const jx = sx + (Math.sin(s * 13 + i) * action.size * 0.45);
            const jy = sy + (Math.cos(s * 17 + i) * action.size * 0.45);
            ctx.fillRect(jx - 1.5, jy - 1.5, 3, 3);
          }
        } else if (action.type === "bubbles") {
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const step = Math.max(12, action.size * 0.85);
          const count = Math.max(1, Math.floor(dist / step));
          for (let b = 1; b <= count; b++) {
            const t = b / count;
            const bx = p1.x + (p2.x - p1.x) * t + (Math.sin(b * 11 + i) * action.size * 0.22);
            const by = p1.y + (p2.y - p1.y) * t + (Math.cos(b * 7 + i) * action.size * 0.22);
            const r = Math.max(4, action.size * (0.38 + (Math.sin(b * 31 + i) + 1) * 0.22));
            drawSoapBubble(ctx, bx, by, r, action.color);
          }
        } else if (action.type === "confetti") {
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const step = Math.max(8, action.size * 0.6);
          const count = Math.max(1, Math.floor(dist / step));
          for (let c = 1; c <= count; c++) {
            const t = c / count;
            const cx = p1.x + (p2.x - p1.x) * t + (Math.sin(c * 23 + i) * action.size * 0.45);
            const cy = p1.y + (p2.y - p1.y) * t + (Math.cos(c * 29 + i) * action.size * 0.45);
            drawConfettiPiece(ctx, cx, cy, action.size, action.color, i * 7 + c * 13);
          }
        } else if (action.type === "fire") {
          // Outer red flame
          ctx.save();
          ctx.strokeStyle = "#dc2626";
          ctx.lineWidth = action.size * 1.6;
          ctx.globalAlpha = 0.55;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Mid orange body
          ctx.strokeStyle = "#f97316";
          ctx.lineWidth = action.size * 0.95;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Inner hot yellow core
          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = Math.max(2, action.size * 0.35);
          ctx.globalAlpha = 0.95;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();

          // Crackling floating embers drifting upward
          const emberX = p2.x + (Math.sin(i * 19) * action.size * 0.65);
          const emberY = p2.y - Math.abs(Math.cos(i * 23)) * action.size * 1.25;
          ctx.fillStyle = i % 2 === 0 ? "#fef08a" : "#f97316";
          const eSize = Math.max(2, action.size * 0.16);
          ctx.fillRect(emberX - eSize / 2, emberY - eSize / 2, eSize, eSize);
        } else if (action.type === "flower") {
          // Playful green connector vine
          ctx.strokeStyle = "#4ade80";
          ctx.lineWidth = Math.max(2, action.size * 0.22);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const step = Math.max(18, action.size * 1.3);
          const count = Math.max(1, Math.floor(dist / step));
          for (let f = 1; f <= count; f++) {
            const t = f / count;
            const fx = p1.x + (p2.x - p1.x) * t;
            const fy = p1.y + (p2.y - p1.y) * t;
            drawFlowerBlossom(ctx, fx, fy, action.size, action.color);
          }
        } else if (action.type === "cloud") {
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const step = Math.max(6, action.size * 0.35);
          const count = Math.max(1, Math.floor(dist / step));
          for (let cl = 1; cl <= count; cl++) {
            const t = cl / count;
            const clx = p1.x + (p2.x - p1.x) * t;
            const cly = p1.y + (p2.y - p1.y) * t;
            drawFluffyCloudPuff(ctx, clx, cly, Math.max(5, action.size * 0.7), action.color);
          }
        } else if (action.type === "spray") {
          // Spray throws random spatters around coordinate segments
          ctx.fillStyle = action.color;
          const radius = action.size * 1.5;
          const density = Math.min(30, Math.floor(action.size * 1.5));
          
          for (let k = 0; k < density; k++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius;
            const sprayX = p2.x + Math.cos(angle) * dist;
            const sprayY = p2.y + Math.sin(angle) * dist;
            ctx.fillRect(sprayX, sprayY, 2, 2);
          }
        } else if (action.type === "eraser") {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    // Restore default state parameters
    ctx.globalCompositeOperation = "source-over";
  };

  // Get coordinate copies for symmetry setting
  const getSymmetryCoordinates = (
    x: number,
    y: number,
    w: number,
    h: number,
    sym: SymmetryType
  ): { x: number; y: number }[] => {
    if (sym === "none") return [{ x, y }];
    if (sym === "horizontal") return [{ x, y }, { x: w - x, y }];
    if (sym === "vertical") return [{ x, y }, { x, y: h - y }];
    return [
      { x, y },
      { x: w - x, y },
      { x, y: h - y },
      { x: w - x, y: h - y }
    ];
  };

  // Mouse / Touch Handlers
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      if (!touch) return { x: 0, y: 0 };
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // High precision zoom-aware coordinate scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const rawX = (clientX - rect.left) * scaleX;
    const rawY = (clientY - rect.top) * scaleY;

    return {
      x: Math.max(0, Math.min(canvas.width, rawX)),
      y: Math.max(0, Math.min(canvas.height, rawY)),
    };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default scrolling behaviour when using finger to draw on mobile
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for multi-touch (pinch-to-zoom or two-finger pan on touchscreens/iPads)
    if ("touches" in e && e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      if (t1 && t2) {
        isMultiTouchRef.current = true;
        isPanningRef.current = true;
        setIsPanning(true);
        lastTouchDistRef.current = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        lastTouchCenterRef.current = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };
        return;
      }
    }

    // Check if user is in Pan/Move mode, pressed middle mouse button, or held Spacebar
    const isMiddleClick = "button" in e && (e as React.MouseEvent).button === 1;
    if (isPanMode || isMiddleClick || isSpacePressedRef.current) {
      isPanningRef.current = true;
      setIsPanning(true);
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as React.MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : (e as React.MouseEvent).clientY;
      panStartRef.current = {
        x: clientX - pan.x,
        y: clientY - pan.y,
      };
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPointerPos(e);

    // If user has unselected color and tries to paint with a color-dependent brush
    if (
      !brushColor &&
      brushType !== "eraser" &&
      brushType !== "rainbow" &&
      brushType !== "confetti" &&
      brushType !== "fire" &&
      !(brushType === "stamp" && selectedStamp)
    ) {
      setShowNoColorNotice(true);
      setTimeout(() => setShowNoColorNotice(false), 2500);
      return;
    }

    setIsDrawing(true);

    if (brushType === "stamp" && selectedStamp) {
      // Create stamp record immediately on press
      const customEmoji = selectedStamp.emoji;
      const newAction: DrawingAction = {
        points: [{ x, y }],
        color: brushColor || "#f43f5e",
        size: brushSize,
        type: "stamp",
        symmetry: symmetry,
        stampId: customEmoji,
        stampX: x,
        stampY: y,
      };
      
      // Draw stamp instantly
      drawStampOnContext(ctx, customEmoji, x, y, brushSize, symmetry);
      setHistory([...history, newAction]);
      setRedoStack([]);
    } else {
      // Start freehand continuous line stroke
      const strokeColor = brushColor || (brushType === "eraser" ? "rgba(0,0,0,1)" : "#f43f5e");
      const newAction: DrawingAction = {
        points: [{ x, y }],
        color: strokeColor,
        size: brushSize,
        type: brushType,
        symmetry: symmetry,
      };

      currentActionRef.current = newAction;
      // Draw instant dot on press (so single tap erases or paints immediately)
      drawLinesOnContext(ctx, newAction);
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Multi-touch pinch zoom & two-finger pan
    if ("touches" in e && e.touches.length === 2 && isMultiTouchRef.current) {
      if (e.cancelable) e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      if (t1 && t2 && lastTouchDistRef.current && lastTouchCenterRef.current) {
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        const scaleChange = dist / lastTouchDistRef.current;
        
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const newZoom = Math.min(4, Math.max(1, Math.round(zoom * scaleChange * 100) / 100));
          const dx = midX - lastTouchCenterRef.current.x;
          const dy = midY - lastTouchCenterRef.current.y;
          
          lastTouchDistRef.current = dist;
          lastTouchCenterRef.current = { x: midX, y: midY };

          updateZoom(newZoom, { clientX: midX, clientY: midY });
          setPan((prev) => clampPan(prev.x + dx, prev.y + dy, newZoom, rect.width, rect.height));
        }
      }
      return;
    }

    // Dragging canvas in Pan/Move mode
    if (isPanningRef.current) {
      if (e.cancelable) e.preventDefault();
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as React.MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : (e as React.MouseEvent).clientY;
      const container = containerRef.current;
      if (container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const newX = clientX - panStartRef.current.x;
        const newY = clientY - panStartRef.current.y;
        setPan(clampPan(newX, newY, zoom, w, h));
      }
      return;
    }

    const { x, y } = getPointerPos(e);
    setCursorPos({ x, y });

    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (brushType !== "stamp" && currentActionRef.current) {
      const act = currentActionRef.current;
      act.points.push({ x, y });

      // Live-draw segment
      drawLinesOnContext(ctx, {
        ...act,
        points: act.points.slice(-2) // Only draw last added segment to keep drawing fast!
      });
    }
  };

  const handlePointerUp = () => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      setIsPanning(false);
      isMultiTouchRef.current = false;
      lastTouchDistRef.current = null;
      lastTouchCenterRef.current = null;
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    if (brushType !== "stamp" && currentActionRef.current) {
      const act = currentActionRef.current;
      if (act.points.length > 0) {
        setHistory([...history, act]);
        setRedoStack([]);
      }
    }
    currentActionRef.current = null;
  };

  // Toggle between eraser and standard/previous brush
  const toggleEraser = () => {
    if (!onSetBrushType) return;
    if (brushType === "eraser") {
      onSetBrushType(lastDrawingBrush);
    } else {
      if (brushType !== "stamp") {
        setLastDrawingBrush(brushType);
      }
      onSetBrushType("eraser");
    }
  };

  // Generates combined image with background, user drawing, and vector outline overlay
  const generateCompositeCanvas = async (): Promise<{ dataUrl: string; blob: Blob | null }> => {
    const canvas = canvasRef.current;
    if (!canvas) return { dataUrl: "", blob: null };

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const eCtx = exportCanvas.getContext("2d");
    if (!eCtx) return { dataUrl: "", blob: null };

    // 1. Render template solid background color
    eCtx.fillStyle = selectedTemplateBg || "#ffffff";
    eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // 2. Overlay the child's actual drawings
    eCtx.drawImage(canvas, 0, 0);

    // 3. Overlay the vector outline stencil if present
    const svgStr = selectedTemplateSvg;
    if (svgStr && svgStr.includes("<svg")) {
      await new Promise<void>((resolve) => {
        const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          eCtx.drawImage(img, 0, 0, exportCanvas.width, exportCanvas.height);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
      });
    }

    const dataUrl = exportCanvas.toDataURL("image/png");
    const blob = await new Promise<Blob | null>((resolve) => {
      exportCanvas.toBlob((b) => resolve(b), "image/png");
    });

    return { dataUrl, blob };
  };

  // Compares drawing canvas with active transparent overlay outlines to generate an authentic combined image download
  const handleDownload = async () => {
    const { dataUrl } = await generateCompositeCanvas();
    if (!dataUrl) return;

    const a = document.createElement("a");
    a.download = `my-drawing-${Date.now()}.png`;
    a.href = dataUrl;
    a.click();
  };

  // Prepares composite drawing and opens the social share modal
  const handleOpenShare = async () => {
    try {
      setIsGeneratingShare(true);
      const { dataUrl, blob } = await generateCompositeCanvas();
      setShareDataUrl(dataUrl);
      setShareBlob(blob);
      setIsShareOpen(true);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Undo/Redo & Utility Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white/30 backdrop-blur-xl p-3 rounded-2xl border border-white/40 shadow-sm animate-fade-in">
        <div className="flex flex-wrap items-center gap-2">
          {/* Undo Action */}
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer font-bold flex items-center gap-1 text-xs transition-all ${
              history.length === 0
                ? "bg-white/20 text-indigo-900/40 cursor-not-allowed"
                : "bg-white/60 hover:bg-white text-indigo-900 active:scale-95 border border-white/50 shadow-sm"
            }`}
          >
            <RotateCcw className="w-4 h-4" /> Undo
          </button>

          {/* Redo Action */}
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer font-bold flex items-center gap-1 text-xs transition-all ${
              redoStack.length === 0
                ? "bg-white/20 text-indigo-900/40 cursor-not-allowed"
                : "bg-white/60 hover:bg-white text-indigo-900 active:scale-95 border border-white/50 shadow-sm"
            }`}
          >
            <RotateCw className="w-4 h-4" /> Redo
          </button>

          {/* Dedicated Eraser Tool Button */}
          {onSetBrushType && (
            <button
              onClick={toggleEraser}
              className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer font-black flex items-center gap-1.5 text-xs transition-all shadow-sm ${
                brushType === "eraser"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 ring-2 ring-amber-300 scale-105 shadow-amber-200"
                  : "bg-white/60 hover:bg-white text-indigo-900 active:scale-95 border border-white/50"
              }`}
              title={brushType === "eraser" ? "Click to switch back to paint brush" : "Click to wipe away spilled paint with the eraser"}
            >
              <Eraser className="w-4 h-4 text-amber-700" />
              <span>{brushType === "eraser" ? "Erasing 🧼" : "Eraser 🧼"}</span>
            </button>
          )}

          {/* Quick Zoom & Move Tool in Top Toolbar */}
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md px-2 py-1 rounded-xl border border-indigo-100 shadow-2xs">
            {/* Zoom Out Button */}
            <button
              onClick={() => updateZoom(zoom - 0.5)}
              disabled={zoom <= 1}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                zoom <= 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-indigo-900 hover:bg-white hover:shadow-xs active:scale-90 cursor-pointer"
              }`}
              title="Zoom out (see whole picture)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Current Zoom Level Badge (Clicking resets to 100%) */}
            <button
              onClick={handleResetZoom}
              className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                zoom > 1
                  ? "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                  : "text-indigo-900 hover:bg-white/80"
              }`}
              title={zoom > 1 ? "Click to reset zoom back to 100%" : "Zoom scale (100% normal view)"}
            >
              <span>{Math.round(zoom * 100)}%</span>
              {zoom > 1 && <span className="text-[10px] ml-1">🔬</span>}
            </button>

            {/* Zoom In Button */}
            <button
              onClick={() => updateZoom(zoom + 0.5)}
              disabled={zoom >= 4}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                zoom >= 4
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-indigo-900 hover:bg-white hover:shadow-xs active:scale-90 cursor-pointer"
              }`}
              title="Zoom in (draw tiny details!)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Hand / Pan Move Mode Toggle */}
            <button
              onClick={() => setIsPanMode(!isPanMode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                isPanMode
                  ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 ring-2 ring-amber-300 shadow-sm"
                  : "text-indigo-900 hover:bg-white/80"
              }`}
              title={isPanMode ? "Move Mode Active! Tap to switch back to Paint" : "Move Canvas: Click and drag anywhere to slide the drawing around"}
            >
              <Hand className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">{isPanMode ? "Moving 🖐️" : "Move 🖐️"}</span>
            </button>

            {/* Quick 1x Reset button if zoomed in */}
            {zoom > 1 && (
              <button
                onClick={handleResetZoom}
                className="px-2 py-0.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 text-[11px] font-black cursor-pointer transition active:scale-90"
                title="Reset zoom to 100% normal view"
              >
                1x 🎯
              </button>
            )}
          </div>
        </div>

        {/* Clear, Share and Save Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent Open / My Drawings Button */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            title="Open saved drawings from your Art Book"
            className="px-3.5 sm:px-4 py-2 rounded-xl cursor-pointer bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-amber-200 border-2 border-amber-300 ring-2 ring-amber-200/50"
          >
            <FolderHeart className="w-4 h-4 fill-amber-950 text-amber-950" />
            <span>Open / My Drawings 📂</span>
            <span className="bg-amber-950 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black ml-0.5">
              {savedDrawings.length}
            </span>
          </button>

          {/* Quick Open Image File from Device */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Open a picture or photo from your computer or tablet to draw on"
            className="hidden sm:flex px-3 py-2 rounded-xl cursor-pointer bg-white/70 hover:bg-white text-indigo-950 font-black text-xs items-center gap-1 active:scale-95 transition-all border border-indigo-100 shadow-2xs"
          >
            <span>Open Image 🖼️</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImportImageFile}
            className="hidden"
          />

          {/* Download & Save to Local Storage History */}
          <button
            onClick={handleSaveButtonClick}
            title="Save drawing to local storage history and download file"
            className="px-3 sm:px-5 py-2 rounded-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-indigo-200"
          >
            <Save className="w-4 h-4 text-yellow-300" />
            <span>Save 🏆</span>
          </button>

          {/* Dustbin Clear */}
          <button
            onClick={handleClearCanvas}
            title="Wipe canvas clean"
            className="px-3 sm:px-3.5 py-2 rounded-xl cursor-pointer bg-rose-50/70 hover:bg-rose-100/90 border border-rose-200/70 text-rose-700 active:scale-90 transition-all font-bold text-xs flex items-center gap-1 shadow-xs"
          >
            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Clear</span> 🧹
          </button>

          {/* Social Media Share Button */}
          <button
            onClick={handleOpenShare}
            disabled={isGeneratingShare}
            title="Share drawing to WhatsApp, Facebook, X, or copy link"
            className="px-3 sm:px-3.5 py-2 rounded-xl cursor-pointer bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-pink-200"
          >
            <Share2 className="w-4 h-4" />
            <span>{isGeneratingShare ? "..." : "Share 💖"}</span>
          </button>
        </div>
      </div>

      {/* Active Drawing Banner if opened from history */}
      {activeDrawingTitle && (
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-white/85 backdrop-blur-md rounded-2xl text-xs font-bold text-indigo-950 border-2 border-pink-200 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 truncate">
            <BookmarkCheck className="w-4 h-4 text-pink-600 shrink-0" />
            <span className="truncate">
              Currently Editing: <strong className="text-pink-600">{activeDrawingTitle}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="text-[11px] font-black text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1 border border-amber-200"
              title="Open a different saved artwork"
            >
              <FolderHeart className="w-3 h-3 fill-amber-900 text-amber-900" />
              <span>Open Other 📂</span>
            </button>
            <button
              onClick={() => handleSaveToHistory()}
              className="text-[11px] font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-2xs"
            >
              <Save className="w-3 h-3" />
              <span>Update Saved 💾</span>
            </button>
            <button
              onClick={() => handleStartNewDrawing()}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              New Canvas 📄
            </button>
          </div>
        </div>
      )}

      {/* Quick Eraser Assistant Bar */}
      {brushType === "eraser" && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200/90 px-4 py-2.5 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 text-amber-950 font-black text-xs">
            <span className="text-xl">🧼</span>
            <div>
              <span className="block leading-tight">Magic Eraser Active</span>
              <span className="text-[10px] font-bold text-amber-800/80 block leading-tight">
                Rub away spilled colors outside lines. (Coloring outlines won't be erased!)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-amber-900 hidden sm:inline">Eraser Size:</span>
            {[
              { label: "Fine ✏️", size: 10, desc: "For tight lines" },
              { label: "Medium 🧽", size: 24, desc: "Normal" },
              { label: "Wide 🧹", size: 48, desc: "Big spills" },
            ].map((preset) => (
              <button
                key={preset.size}
                onClick={() => onSetBrushSize && onSetBrushSize(preset.size)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95 ${
                  Math.abs(brushSize - preset.size) < 7
                    ? "bg-amber-500 text-white shadow-xs scale-105 ring-2 ring-amber-400"
                    : "bg-white hover:bg-amber-100/80 text-amber-950 border border-amber-200 shadow-2xs"
                }`}
                title={preset.desc}
              >
                {preset.label}
              </button>
            ))}

            <button
              onClick={toggleEraser}
              className="ml-1 sm:ml-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs cursor-pointer active:scale-95 transition"
            >
              Back to Paint 🎨
            </button>
          </div>
        </div>
      )}

      {/* Active Selections & One-Click Deselect Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-black text-indigo-950/70 uppercase tracking-wider mr-1">
            Active:
          </span>

          {/* Color Selection Chip */}
          {activeColorObj ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-indigo-900 font-bold border border-indigo-100 shadow-2xs text-[11px]">
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-black/20"
                style={{ backgroundColor: activeColorObj.value }}
              />
              <span>{activeColorObj.name}</span>
              {onSetBrushColor && (
                <button
                  onClick={() => onSetBrushColor(null)}
                  className="text-gray-400 hover:text-rose-600 transition ml-0.5 p-0.5 rounded-full hover:bg-rose-50 cursor-pointer"
                  title="Unselect active color"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-bold border border-amber-200 text-[11px]">
              <span>⚠️ No color</span>
            </span>
          )}

          {/* Sticker Selection Chip */}
          {brushType === "stamp" && selectedStamp && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900 font-bold border border-pink-300 shadow-2xs text-[11px]">
              <span>{selectedStamp.emoji}</span>
              <span>Sticker: {selectedStamp.label}</span>
              {onSetSelectedStamp && onSetBrushType && (
                <button
                  onClick={() => {
                    onSetSelectedStamp(null);
                    onSetBrushType("brush");
                  }}
                  className="text-pink-600 hover:text-pink-900 transition ml-0.5 p-0.5 rounded-full hover:bg-pink-200 cursor-pointer"
                  title="Unselect sticker and return to drawing"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {/* Special Brush / Eraser Chip */}
          {brushType !== "brush" && brushType !== "stamp" && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold shadow-2xs text-[11px] ${
                brushType === "eraser"
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-indigo-100 text-indigo-900 border border-indigo-200"
              }`}
            >
              <span>
                {brushType === "eraser"
                  ? "🧼 Magic Eraser"
                  : brushType === "rainbow"
                  ? "🌈 Rainbow"
                  : brushType === "neon"
                  ? "✨ Neon"
                  : brushType === "sparkle"
                  ? "🌟 Sparkles"
                  : brushType === "bubbles"
                  ? "🫧 Bubbles"
                  : brushType === "fire"
                  ? "🔥 Dragon Fire"
                  : brushType === "confetti"
                  ? "🎊 Confetti"
                  : brushType === "flower"
                  ? "🌸 Blossom Trail"
                  : brushType === "cloud"
                  ? "☁️ Fluffy Cloud"
                  : brushType === "spray"
                  ? "💨 Spray"
                  : "🖍️ Crayon"}
              </span>
              {onSetBrushType && (
                <button
                  onClick={() => onSetBrushType("brush")}
                  className="text-indigo-600 hover:text-indigo-900 transition ml-0.5 p-0.5 rounded-full hover:bg-indigo-200 cursor-pointer"
                  title="Unselect style and return to classic brush"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {/* Symmetry Mirror Chip */}
          {symmetry !== "none" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-200 shadow-2xs text-[11px]">
              <span>🪞 Mirror: {symmetry === "horizontal" ? "Left-Right" : symmetry === "vertical" ? "Top-Bottom" : "4-Way"}</span>
              {onSetSymmetry && (
                <button
                  onClick={() => onSetSymmetry("none")}
                  className="text-purple-600 hover:text-purple-900 transition ml-0.5 p-0.5 rounded-full hover:bg-purple-200 cursor-pointer"
                  title="Unselect mirror"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {/* Coloring Sheet Chip */}
          {selectedTemplate && selectedTemplate.id !== "blank" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 shadow-2xs text-[11px]">
              <span>{selectedTemplate.icon}</span>
              <span>Sheet: {selectedTemplate.name}</span>
              {onSetSelectedTemplate && (
                <button
                  onClick={() => onSetSelectedTemplate(TEMPLATES[0]!)}
                  className="text-emerald-700 hover:text-emerald-950 transition ml-0.5 p-0.5 rounded-full hover:bg-emerald-200 cursor-pointer"
                  title="Unselect coloring sheet (return to blank canvas)"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {/* Minimal Zoom Level Chip (Outside Canvas) */}
          {zoom > 1 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold border border-indigo-200 shadow-2xs text-[11px]">
              <span>🔬 Zoom: {Math.round(zoom * 100)}%</span>
              <button
                onClick={handleResetZoom}
                className="text-indigo-600 hover:text-indigo-900 transition ml-0.5 p-0.5 rounded-full hover:bg-indigo-200 cursor-pointer"
                title="Reset zoom to 100%"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Minimal Move Mode Active Chip (Outside Canvas) */}
          {isPanMode && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs text-[11px]">
              <span>🖐️ Move Canvas Active</span>
              <button
                onClick={() => setIsPanMode(false)}
                className="text-amber-800 hover:text-amber-950 transition ml-0.5 p-0.5 rounded-full hover:bg-amber-200 cursor-pointer"
                title="Switch back to paint"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Quick Clear All Selections back to Default Brush */}
        {(selectedStamp || symmetry !== "none" || brushType !== "brush" || (selectedTemplate && selectedTemplate.id !== "blank") || !brushColor || zoom > 1 || isPanMode) && (
          <button
            onClick={() => {
              if (onSetBrushType) onSetBrushType("brush");
              if (onSetSelectedStamp) onSetSelectedStamp(null);
              if (onSetSymmetry) onSetSymmetry("none");
              if (!brushColor && onSetBrushColor) onSetBrushColor("#f43f5e");
              handleResetZoom();
            }}
            className="text-[10px] font-black text-indigo-900/60 hover:text-indigo-950 hover:underline cursor-pointer"
            title="Reset active tools to standard drawing"
          >
            Reset Tools ↺
          </button>
        )}
      </div>

      {/* Gentle toast if user draws without a color */}
      {showNoColorNotice && (
        <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-2xl text-xs font-bold text-center animate-in fade-in slide-in-from-top-1 shadow-sm flex items-center justify-center gap-2">
          <span>🎨</span>
          <span>No paint color is selected! Please tap any paint color below to draw.</span>
        </div>
      )}

      {/* Main Drawing Stage Box */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        style={{ backgroundColor: selectedTemplateBg }}
        className={`relative flex-1 rounded-[3rem] border-[12px] border-white/60 bg-white shadow-2xl overflow-hidden min-h-[360px] touch-none select-none transition-colors duration-300 ${
          isPanMode
            ? isPanning
              ? "cursor-grabbing"
              : "cursor-grab"
            : brushType === "eraser"
            ? "cursor-none"
            : "cursor-crosshair"
        }`}
      >
        {/* Scalable & Pannable Canvas Viewport */}
        <div
          ref={zoomWrapperRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
          }}
          className="relative w-full h-full will-change-transform"
        >
          {/* Dynamic Translucent SVG Stencil Outline (Coloring overlay layers) */}
          {selectedTemplateSvg && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.9] select-none z-1"
              dangerouslySetInnerHTML={{ __html: selectedTemplateSvg }}
            />
          )}

          {/* Core Canvas Element */}
          <canvas
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={() => {
              setCursorPos(null);
              handlePointerUp();
            }}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={() => {
              setCursorPos(null);
              handlePointerUp();
            }}
            className="absolute inset-0 w-full h-full bg-transparent z-0 active:scale-[0.999] transition-transform"
          />

          {/* Live Floating Eraser Ring Indicator showing exact cleanup area */}
          {brushType === "eraser" && !isPanMode && cursorPos && (
            <div
              className="pointer-events-none absolute rounded-full border-2 border-amber-600 bg-amber-400/25 shadow-sm transform -translate-x-1/2 -translate-y-1/2 z-20 transition-[width,height] duration-75"
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                width: `${brushSize}px`,
                height: `${brushSize}px`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}

          {/* Symmetry Grid Overlay Assistant Line indicator (shows kids where the magic mirrors are) */}
          {symmetry !== "none" && (
            <div className="absolute inset-0 pointer-events-none z-1 flex items-center justify-center opacity-25">
              {symmetry === "horizontal" && (
                <div className="w-0.5 h-full bg-indigo-500 border-l border-dashed border-indigo-300" />
              )}
              {symmetry === "vertical" && (
                <div className="h-0.5 w-full bg-indigo-500 border-t border-dashed border-indigo-300" />
              )}
              {symmetry === "kaleidoscope" && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-0.5 h-full bg-indigo-500 border-l border-dashed border-indigo-300" />
                  <div className="absolute h-0.5 w-full bg-indigo-500 border-t border-dashed border-indigo-300" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-950/95 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-indigo-700/60 backdrop-blur-md flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Media Sharing Modal */}
      <ShareDrawingModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        imageDataUrl={shareDataUrl}
        imageBlob={shareBlob}
        templateName={selectedTemplateName}
      />

      {/* Drawing History & Saved Artworks Modal */}
      <DrawingHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        savedDrawings={savedDrawings}
        activeDrawingId={activeDrawingId}
        onLoadDrawing={handleLoadDrawing}
        onSaveCurrentToHistory={handleSaveToHistory}
        onDeleteDrawing={handleDeleteDrawing}
        onRenameDrawing={handleRenameDrawing}
        onToggleFavorite={handleToggleFavorite}
        onStartNewDrawing={handleStartNewDrawing}
        hasCurrentDrawingStrokes={history.length > 0}
        onImportImageFile={handleImportImageFile}
      />
    </div>
  );
}
