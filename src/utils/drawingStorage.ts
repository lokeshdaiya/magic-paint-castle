import { SavedDrawing, DrawingAction } from "../types";

const DRAWINGS_STORAGE_KEY = "magic_paint_saved_drawings_history_v1";
const CANVAS_DRAFT_KEY = "magic_paint_current_canvas_draft_v1";

/**
 * Generate a lightweight, compressed thumbnail data URL from a canvas
 * Keeps localStorage footprint minimal (~10-20KB per drawing)
 */
export function generateCanvasThumbnail(
  sourceCanvas: HTMLCanvasElement,
  maxWidth = 280,
  maxHeight = 210,
  quality = 0.75
): string {
  try {
    const thumbCanvas = document.createElement("canvas");
    let { width, height } = sourceCanvas;
    
    if (width <= 0 || height <= 0) {
      width = 300;
      height = 200;
    }

    // Calculate aspect ratio fit
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    const targetWidth = Math.max(80, Math.floor(width * ratio));
    const targetHeight = Math.max(60, Math.floor(height * ratio));

    thumbCanvas.width = targetWidth;
    thumbCanvas.height = targetHeight;

    const ctx = thumbCanvas.getContext("2d");
    if (!ctx) return "";

    // Fill white background for clean thumbnail
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Draw downscaled source
    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

    // Prefer webp if supported, fallback to jpeg
    return thumbCanvas.toDataURL("image/jpeg", quality);
  } catch (err) {
    console.warn("Failed to generate thumbnail:", err);
    return "";
  }
}

/**
 * Load all saved drawings from localStorage, sorted by newest first
 */
export function loadSavedDrawings(): SavedDrawing[] {
  try {
    const raw = localStorage.getItem(DRAWINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
  } catch (err) {
    console.error("Error reading saved drawings from localStorage:", err);
    return [];
  }
}

/**
 * Helper to safely write drawings array to localStorage with quota protection
 */
function safelyWriteDrawings(drawings: SavedDrawing[]): boolean {
  try {
    localStorage.setItem(DRAWINGS_STORAGE_KEY, JSON.stringify(drawings));
    return true;
  } catch (err: unknown) {
    // If quota exceeded, attempt to prune oldest non-favorite drawings
    if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.code === 22)) {
      console.warn("Storage quota exceeded. Pruning oldest drawings to make room...");
      const nonFavorites = drawings.filter((d) => !d.favorite);
      if (nonFavorites.length > 2) {
        // Remove oldest 2 non-favorites
        const keepIds = new Set(
          [...drawings]
            .filter((d) => d.favorite || nonFavorites.indexOf(d) < nonFavorites.length - 2)
            .map((d) => d.id)
        );
        const pruned = drawings.filter((d) => keepIds.has(d.id));
        try {
          localStorage.setItem(DRAWINGS_STORAGE_KEY, JSON.stringify(pruned));
          return true;
        } catch {
          // If still failing, drop thumbnails to lower quality
          const minimal = pruned.map((d) => ({
            ...d,
            thumbnail: d.thumbnail ? d.thumbnail.slice(0, 100) : "",
          }));
          try {
            localStorage.setItem(DRAWINGS_STORAGE_KEY, JSON.stringify(minimal));
            return true;
          } catch {
            return false;
          }
        }
      }
    }
    return false;
  }
}

export interface SaveDrawingInput {
  id?: string;
  title?: string;
  thumbnail: string;
  actions: DrawingAction[];
  templateId: string;
  templateName?: string;
  favorite?: boolean;
}

/**
 * Save or update a drawing in the drawing history
 */
export function saveDrawingToHistory(input: SaveDrawingInput): { drawing: SavedDrawing; allDrawings: SavedDrawing[] } {
  const currentDrawings = loadSavedDrawings();
  const now = Date.now();

  const isExisting = input.id && currentDrawings.some((d) => d.id === input.id);
  const drawingId = isExisting && input.id ? input.id : `art_${now}_${Math.random().toString(36).substring(2, 7)}`;
  
  // Create cute default name if not provided
  const title = input.title && input.title.trim().length > 0 
    ? input.title.trim() 
    : input.templateName && input.templateName !== "Blank Canvas"
      ? `My ${input.templateName} 🎨`
      : `Masterpiece #${currentDrawings.length + 1} ✨`;

  let updatedList: SavedDrawing[];

  if (isExisting) {
    updatedList = currentDrawings.map((item) => {
      if (item.id === drawingId) {
        return {
          ...item,
          title,
          updatedAt: now,
          thumbnail: input.thumbnail || item.thumbnail,
          actions: input.actions,
          templateId: input.templateId,
          templateName: input.templateName || item.templateName,
          strokeCount: input.actions.length,
          favorite: input.favorite !== undefined ? input.favorite : item.favorite,
        };
      }
      return item;
    });
  } else {
    const newDrawing: SavedDrawing = {
      id: drawingId,
      title,
      createdAt: now,
      updatedAt: now,
      thumbnail: input.thumbnail,
      actions: input.actions,
      templateId: input.templateId,
      templateName: input.templateName || "Blank Canvas",
      strokeCount: input.actions.length,
      favorite: !!input.favorite,
    };
    updatedList = [newDrawing, ...currentDrawings];
  }

  safelyWriteDrawings(updatedList);
  const savedItem = updatedList.find((d) => d.id === drawingId)!;
  return { drawing: savedItem, allDrawings: updatedList };
}

/**
 * Delete a drawing from history
 */
export function deleteDrawingFromHistory(id: string): SavedDrawing[] {
  const current = loadSavedDrawings();
  const filtered = current.filter((d) => d.id !== id);
  safelyWriteDrawings(filtered);
  return filtered;
}

/**
 * Rename a drawing in history
 */
export function renameDrawingInHistory(id: string, newTitle: string): SavedDrawing[] {
  const current = loadSavedDrawings();
  const updated = current.map((d) => {
    if (d.id === id) {
      return {
        ...d,
        title: newTitle.trim() || d.title,
        updatedAt: Date.now(),
      };
    }
    return d;
  });
  safelyWriteDrawings(updated);
  return updated;
}

/**
 * Toggle favorite status
 */
export function toggleFavoriteInHistory(id: string): SavedDrawing[] {
  const current = loadSavedDrawings();
  const updated = current.map((d) => {
    if (d.id === id) {
      return {
        ...d,
        favorite: !d.favorite,
        updatedAt: Date.now(),
      };
    }
    return d;
  });
  safelyWriteDrawings(updated);
  return updated;
}

/**
 * Clear all drawings from history
 */
export function clearAllDrawingsFromHistory(): void {
  try {
    localStorage.removeItem(DRAWINGS_STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing drawings history:", err);
  }
}

/**
 * In-progress canvas draft persistence
 */
export interface CanvasDraft {
  actions: DrawingAction[];
  templateId: string;
  templateName?: string;
  timestamp: number;
}

export function saveCanvasDraft(actions: DrawingAction[], templateId: string, templateName?: string): void {
  try {
    if (!actions || actions.length === 0) {
      clearCanvasDraft();
      return;
    }
    const draft: CanvasDraft = {
      actions,
      templateId,
      templateName,
      timestamp: Date.now(),
    };
    localStorage.setItem(CANVAS_DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    // Draft save errors can be ignored safely
    console.debug("Could not save canvas draft:", err);
  }
}

export function loadCanvasDraft(): CanvasDraft | null {
  try {
    const raw = localStorage.getItem(CANVAS_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.actions) && parsed.actions.length > 0) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearCanvasDraft(): void {
  try {
    localStorage.removeItem(CANVAS_DRAFT_KEY);
  } catch {}
}
