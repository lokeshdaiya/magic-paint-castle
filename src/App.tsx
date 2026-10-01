import { useState, useRef, useEffect } from "react";
import { BrushType, SymmetryType, StampOption, TemplateOption, DrawingChallenge } from "./types";
import { TEMPLATES } from "./constants";
import ColorPalette from "./components/ColorPalette";
import KidsToolbar from "./components/KidsToolbar";
import ColoringTemplates from "./components/ColoringTemplates";
import CompanionArea from "./components/CompanionArea";
import DrawingCanvas from "./components/DrawingCanvas";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import { Paintbrush, Palette, Sparkles, Smile, MessageCircle, FolderHeart, ShieldCheck } from "lucide-react";
import { loadSavedDrawings } from "./utils/drawingStorage";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core paint state properties
  const [brushType, setBrushType] = useState<BrushType>("brush");
  const [brushColor, setBrushColor] = useState<string | null>("#f43f5e"); // Bubblegum Pop default
  const [brushSize, setBrushSize] = useState<number>(18);
  const [symmetry, setSymmetry] = useState<SymmetryType>("none");
  const [selectedStamp, setSelectedStamp] = useState<StampOption | null>(null);
  
  // Game/Inspirations and active stencil target sheet
  const [activeChallenge, setActiveChallenge] = useState<DrawingChallenge | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TEMPLATES[0]!); // Blank Canvas default

  // Drawings History Modal state & count
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(() => {
    return window.location.hash === "#privacy" || window.location.pathname === "/privacy";
  });
  const [savedDrawingsCount, setSavedDrawingsCount] = useState<number>(() => {
    try {
      return loadSavedDrawings().length;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#privacy" || window.location.pathname === "/privacy") {
        setIsPrivacyModalOpen(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Simple handler to wipe everything clean
  const handleWipeCanvasClean = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Helper function to restore core drawing brush if user picks a brush color while in stamps or eraser mode
  const handleRestoreBrushOnColorChange = () => {
    if (brushType === "eraser" || brushType === "stamp") {
      setBrushType("brush");
      setSelectedStamp(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden select-none font-sans pb-10" style={{ background: "radial-gradient(circle at 0% 0%, #ff9a9e 0%, #fecfef 50%, #abc1ee 100%)" }}>
      
      {/* Whimsical colored cloud visual blobs in background layout */}
      <div className="absolute top-10 left-[-40px] w-96 h-96 rounded-full bg-pink-100/45 filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-20 right-[-40px] w-96 h-96 rounded-full bg-cyan-100/50 filter blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-yellow-100/35 filter blur-3xl opacity-30 pointer-events-none" />

      {/* Playful Top Header Navigation banner */}
      <header className="bg-white/30 backdrop-blur-xl border-b border-white/40 py-3.5 px-6 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo Heading brand with cute emojis */}
          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-2.5 rounded-2xl shadow-md rotate-[-2deg] flex items-center justify-center">
              <span className="text-3xl animate-bounce">🎨</span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-indigo-900 leading-none">
                Magic Paint <span className="text-pink-600">Castle!</span> ✨
              </h1>
              <p className="text-[11px] font-black text-indigo-950 mt-1 flex items-center gap-1 justify-center sm:justify-start opacity-75">
                <span>🏰</span> The super happy drawing book for little creators! 🦁🌟
              </p>
            </div>
          </div>

          {/* Supportive guidance text + My Drawings / Open + PWA Install */}
          <div className="flex items-center flex-wrap justify-center sm:justify-end gap-2.5">
            <div className="hidden xl:flex items-center gap-2 bg-white/40 border border-white/60 rounded-full py-1.5 px-3.5 text-xs font-black text-indigo-900 shadow-2xs">
              <span className="text-base">🚀</span> Splash magical paints!
            </div>

            {/* Prominent My Drawings & Open Art Book Button */}
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 border-2 border-amber-300 ring-2 ring-amber-200/60 cursor-pointer text-xs sm:text-sm"
              title="Open saved drawings and your Art Book gallery"
            >
              <FolderHeart className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-950 text-amber-950" />
              <span>My Drawings & Open 📂</span>
              <span className="bg-amber-950 text-white text-[11px] px-2 py-0.5 rounded-full font-black min-w-5 text-center shadow-2xs">
                {savedDrawingsCount}
              </span>
            </button>

            {/* Privacy Policy Button */}
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="flex items-center gap-1.5 bg-white/70 hover:bg-white text-indigo-950 font-bold px-3 py-2 rounded-2xl border border-indigo-200 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer text-xs"
              title="Read Privacy Policy (Family & Kid Safe)"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Privacy</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Play Area Workspace Container */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col gap-6 relative z-10">
        
        {/* Responsive Grid layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT AREA: Canvas Drawing Stage and Paints Palette (takes 8 cols on large screen) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Draw Sandbox Box wrapper */}
            <div className="flex-1 flex flex-col min-h-[460px]">
              <DrawingCanvas
                canvasRef={canvasRef}
                brushType={brushType}
                onSetBrushType={setBrushType}
                brushColor={brushColor}
                onSetBrushColor={setBrushColor}
                brushSize={brushSize}
                onSetBrushSize={setBrushSize}
                symmetry={symmetry}
                onSetSymmetry={setSymmetry}
                selectedStamp={selectedStamp}
                onSetSelectedStamp={setSelectedStamp}
                selectedTemplate={selectedTemplate}
                onSetSelectedTemplate={setSelectedTemplate}
                selectedTemplateSvg={selectedTemplate.svgPath}
                selectedTemplateBg={selectedTemplate.bgColor}
                selectedTemplateName={selectedTemplate.name}
                isHistoryModalOpen={isHistoryModalOpen}
                onSetIsHistoryModalOpen={setIsHistoryModalOpen}
                onSavedDrawingsCountChange={setSavedDrawingsCount}
              />
            </div>

            {/* Named Paints Color Selector palette rows */}
            <ColorPalette
              selectedColor={brushColor}
              onSetColor={setBrushColor}
              onRestoreBrushMode={handleRestoreBrushOnColorChange}
            />

            {/* Coloring sheets outline choices row */}
            <ColoringTemplates
              selectedTemplateId={selectedTemplate.id}
              onSelectTemplate={setSelectedTemplate}
              onClearCanvas={handleWipeCanvasClean}
            />
          </div>

          {/* RIGHT AREA: Magic drawing utilities and Animal Buddy (takes 4 cols on large screen) */}
          <div className="lg:col-span-4 flex flex-col md:flex-row lg:flex-col gap-6 md:items-stretch lg:items-stretch">
            
            {/* Fine toolbar settings picker (size, stamp, symmetry) */}
            <div className="flex-1 md:w-1/2 lg:w-full">
              <KidsToolbar
                brushType={brushType}
                onSetBrushType={setBrushType}
                brushSize={brushSize}
                onSetBrushSize={setBrushSize}
                symmetry={symmetry}
                onSetSymmetry={setSymmetry}
                selectedStamp={selectedStamp}
                onSetSelectedStamp={setSelectedStamp}
              />
            </div>

            {/* Magic Mascot area feedback engine (Gemini voice feedback + prompt rolling) */}
            <div className="flex-1 md:w-1/2 lg:w-full">
              <CompanionArea
                canvasRef={canvasRef}
                activeChallenge={activeChallenge}
                onSetChallenge={setActiveChallenge}
                selectedTemplateId={selectedTemplate.id}
              />
            </div>

          </div>

        </div>

      </main>

      {/* Safety info footer & Privacy policy link */}
      <footer className="text-center text-xs font-bold text-indigo-950/80 mt-10 px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span>🐾 Created with lots of love and magic for little painting superstars! 🎈 Soft, safe, and highly artistic.</span>
        <span className="hidden sm:inline opacity-40">•</span>
        <button
          onClick={() => setIsPrivacyModalOpen(true)}
          className="text-indigo-900 underline hover:text-indigo-600 cursor-pointer font-extrabold flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
          Privacy Policy
        </button>
      </footer>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Offline Connectivity Toast */}
      <OfflineIndicator />
    </div>
  );
}
