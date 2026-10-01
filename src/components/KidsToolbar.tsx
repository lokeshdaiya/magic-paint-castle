import { BrushType, SymmetryType, StampOption } from "../types";
import { COLORS, STAMPS } from "../constants";
import { Paintbrush, Sparkles, Wand2, Hammer, Flower, Eraser } from "lucide-react";

interface KidsToolbarProps {
  brushType: BrushType;
  onSetBrushType: (t: BrushType) => void;
  brushSize: number;
  onSetBrushSize: (s: number) => void;
  symmetry: SymmetryType;
  onSetSymmetry: (sym: SymmetryType) => void;
  selectedStamp: StampOption | null;
  onSetSelectedStamp: (stamp: StampOption | null) => void;
}

export default function KidsToolbar({
  brushType,
  onSetBrushType,
  brushSize,
  onSetBrushSize,
  symmetry,
  onSetSymmetry,
  selectedStamp,
  onSetSelectedStamp,
}: KidsToolbarProps) {
  
  const brushOptions = [
    { id: "brush", label: "Classic Brush Paint", short: "Classic Brush", icon: "🎨", desc: "Draw with solid pretty lines!" },
    { id: "crayon", label: "Texture Crayon", short: "Wax Crayon", icon: "🖍️", desc: "Draw with grainy, cute wax crayons!" },
    { id: "rainbow", label: "Rainbow Magical Ribbon", short: "Rainbow Ribbon", icon: "🌈", desc: "Lines change colors automatically!" },
    { id: "neon", label: "Lasers Neon Light", short: "Neon Glow", icon: "✨", desc: "Glows with a super bright center!" },
    { id: "sparkle", label: "Glitter & Star Magic", short: "Glitter Stars", icon: "🌟", desc: "Twinkling star sparkles and shiny glitter!" },
    { id: "bubbles", label: "Soap Bubble Wand", short: "Soap Bubbles", icon: "🫧", desc: "Shiny floating iridescent soap bubbles!" },
    { id: "fire", label: "Dragon Fire & Embers", short: "Dragon Fire", icon: "🔥", desc: "Roaring flaming fire with floating embers!" },
    { id: "confetti", label: "Party Confetti Popper", short: "Party Confetti", icon: "🎊", desc: "Pops colorful party confetti and streamers!" },
    { id: "flower", label: "Flower Blossom Trail", short: "Blossom Trail", icon: "🌸", desc: "Blooms pretty flowers and cute leaves!" },
    { id: "cloud", label: "Fluffy Cloud & Fur", short: "Fluffy Cloud", icon: "☁️", desc: "Soft puffy cotton candy and cuddly fluff!" },
    { id: "spray", label: "Bubble Spray Can", short: "Spray Can", icon: "💨", desc: "Splatter funny colorful bubbles!" },
    { id: "eraser", label: "Magic Eraser", short: "Magic Eraser", icon: "🧼", desc: "Erase colors spilled outside lines!" },
  ];

  const handleSelectStamp = (stamp: StampOption) => {
    if (brushType === "stamp" && selectedStamp?.id === stamp.id) {
      // Toggle off / Unselect sticker!
      onSetSelectedStamp(null);
      onSetBrushType("brush");
    } else {
      onSetSelectedStamp(stamp);
      onSetBrushType("stamp");
    }
  };

  const handleSelectSymmetry = (sym: SymmetryType) => {
    if (symmetry === sym) {
      // Toggle off / Unselect symmetry mirror!
      onSetSymmetry("none");
    } else {
      onSetSymmetry(sym);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl p-5 space-y-5">
      
      {/* 1. Pick Brush Head */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black text-indigo-900 uppercase tracking-widest block">
            1. Choose drawing magic style 🪄
          </span>
          {brushType !== "brush" && (
            <button
              onClick={() => {
                onSetBrushType("brush");
                onSetSelectedStamp(null);
              }}
              className="px-2.5 py-0.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-[10px] font-black border border-indigo-200 shadow-2xs cursor-pointer transition active:scale-95"
              title="Switch back to classic paint brush"
            >
              ✕ Reset to Brush
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
          {brushOptions.map((opt) => {
            const isEraser = opt.id === "eraser";
            const isSelected = brushType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (isSelected && opt.id !== "brush") {
                    // Toggle off to default brush
                    onSetBrushType("brush");
                    onSetSelectedStamp(null);
                  } else {
                    onSetBrushType(opt.id as BrushType);
                    onSetSelectedStamp(null);
                  }
                }}
                title={isSelected ? `Active - tap to unselect` : opt.desc}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? isEraser
                      ? "border-amber-500 bg-amber-50/95 scale-[1.03] shadow-md ring-2 ring-amber-300"
                      : "border-indigo-600 bg-white/95 scale-[1.03] shadow-md ring-2 ring-indigo-300/50"
                    : isEraser
                    ? "border-amber-200/80 hover:border-amber-400 bg-amber-50/50 text-indigo-950"
                    : "border-white/50 hover:border-indigo-300 bg-white/40 text-indigo-950"
                }`}
              >
                <span className="text-3xl mb-1">{opt.icon}</span>
                <span className="text-xs font-black text-center leading-tight">
                  {opt.short || opt.label}
                </span>
                <span className="text-[10px] text-indigo-800 font-medium text-center hidden sm:block opacity-80 mt-0.5">
                  {isSelected && opt.id !== "brush" ? "Tap to unselect" : opt.desc.split("!")[0] || opt.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Helpful Eraser Tip */}
        {brushType === "eraser" && (
          <div className="mt-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 flex items-center gap-1.5 shadow-xs">
            <span className="text-base flex-shrink-0">💡</span>
            <span>Rub over any paint that spilled outside the lines. The coloring outlines won't be erased!</span>
          </div>
        )}
      </div>

      {/* 2. Choose Size */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">
            2. Thickness or sticker size 📏
          </span>
          <span className="text-[10px] font-black bg-indigo-900/10 text-indigo-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {brushSize < 12 ? "Thin ✨" : brushSize < 30 ? "Chubby 🌟" : "Gigantic! 🦖"}
          </span>
        </div>
        
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-white/60">
          {/* Animated Brush indicator circle preview */}
          <div className="w-12 h-12 rounded-full border border-dashed border-white/80 flex items-center justify-center bg-white/60 flex-shrink-0 overflow-hidden">
            <div
              style={{
                width: `${Math.max(6, brushSize * 1.05)}px`,
                height: `${Math.max(6, brushSize * 1.05)}px`,
                maxHeight: "42px",
                maxWidth: "42px",
                background:
                  brushType === "eraser"
                    ? "#94a3b8"
                    : brushType === "rainbow"
                    ? "linear-gradient(45deg, #f43f5e, #eab308, #10b981, #3b82f6, #8b5cf6)"
                    : brushType === "neon"
                    ? "#06b6d4"
                    : brushType === "fire"
                    ? "linear-gradient(45deg, #dc2626, #f97316, #fef08a)"
                    : brushType === "sparkle"
                    ? "#facc15"
                    : brushType === "bubbles"
                    ? "#67e8f9"
                    : brushType === "confetti"
                    ? "linear-gradient(45deg, #ec4899, #3b82f6, #eab308)"
                    : brushType === "flower"
                    ? "#f472b6"
                    : brushType === "cloud"
                    ? "#cbd5e1"
                    : COLORS[0]?.value,
              }}
              className="rounded-full shadow-inner transition-all duration-100 flex items-center justify-center text-[10px]"
            />
          </div>

          <input
            type="range"
            min="4"
            max="45"
            value={brushSize}
            onChange={(e) => onSetBrushSize(Number(e.target.value))}
            className="w-full h-3 bg-white/60 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* 3. Magic Symmetry Mirror Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-indigo-900 uppercase tracking-widest block">
            3. Symmetrical Magic Mirrors 🪞
          </span>
          {symmetry !== "none" && (
            <button
              onClick={() => onSetSymmetry("none")}
              className="px-2.5 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-black border border-rose-300 shadow-2xs cursor-pointer transition active:scale-95"
              title="Unselect symmetry mirror"
            >
              ✕ Deselect Mirror
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5 bg-white/40 p-1.5 rounded-2xl border border-white/60">
          {(["none", "horizontal", "vertical", "kaleidoscope"] as SymmetryType[]).map((sym) => {
            const symEmojis = { none: "☝️", horizontal: "↔️", vertical: "↕️", kaleidoscope: "🌀" };
            const symLabels = { none: "Single", horizontal: "Left-Right", vertical: "Top-Bottom", kaleidoscope: "4-Way" };
            const isSelected = symmetry === sym;
            
            return (
              <button
                key={sym}
                onClick={() => handleSelectSymmetry(sym)}
                title={isSelected && sym !== "none" ? "Active mirror - click to unselect" : `Select ${symLabels[sym]}`}
                className={`py-2 px-1 rounded-xl text-[10px] font-black flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-900 text-white shadow scale-[1.03]"
                    : "text-indigo-950 hover:bg-white/80"
                }`}
              >
                <span className="text-xl mb-0.5">{symEmojis[sym]}</span>
                <span className="truncate w-full text-center leading-none scale-[0.9]">
                  {symLabels[sym]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Sticker Stamps Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black text-indigo-900 uppercase tracking-widest block">
            4. Sticky Stamps & Decals ⭐
          </span>
          {brushType === "stamp" && selectedStamp && (
            <button
              onClick={() => {
                onSetSelectedStamp(null);
                onSetBrushType("brush");
              }}
              className="px-2.5 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-black border border-rose-300 shadow-2xs cursor-pointer transition active:scale-95 flex items-center gap-1"
              title="Unselect active sticker and return to drawing"
            >
              <span>✕ Deselect Sticker ({selectedStamp.emoji})</span>
            </button>
          )}
        </div>
        <div className="bg-white/30 rounded-2xl p-2.5 border border-dashed border-white/60">
          <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1">
            {STAMPS.map((stamp) => {
              const isSelected = brushType === "stamp" && selectedStamp?.id === stamp.id;
              return (
                <button
                  key={stamp.id}
                  onClick={() => handleSelectStamp(stamp)}
                  title={isSelected ? `Selected: ${stamp.label} - Click to unselect` : `Select ${stamp.label}`}
                  className={`text-2xl p-2 rounded-xl transition-all cursor-pointer bg-white/70 relative hover:scale-110 flex items-center justify-center hover:bg-white border ${
                    isSelected
                      ? "border-pink-500 bg-pink-50 text-white scale-110 shadow-md ring-2 ring-pink-400 z-1"
                      : "border-white/50 text-gray-800"
                  }`}
                >
                  <span>{stamp.emoji}</span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-[8px] text-white font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}
