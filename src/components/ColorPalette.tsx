import { ColorOption } from "../types";
import { COLORS } from "../constants";
import { X, Check } from "lucide-react";

interface ColorPaletteProps {
  selectedColor: string | null;
  onSetColor: (color: string | null) => void;
  onRestoreBrushMode: () => void;
}

export default function ColorPalette({
  selectedColor,
  onSetColor,
  onRestoreBrushMode,
}: ColorPaletteProps) {
  const activeColorObj = selectedColor 
    ? COLORS.find((c) => c.value.toLowerCase() === selectedColor.toLowerCase())
    : null;

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl p-4 sm:p-5">
      {/* Header with active selection and unselect button */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">
            Pick Your Magic Paints 🎨
          </span>
          {activeColorObj ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/80 border border-indigo-200 text-indigo-900 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full ring-1 ring-black/20" style={{ backgroundColor: activeColorObj.value }} />
              <span>{activeColorObj.name}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span>⚠️ No color selected</span>
            </span>
          )}
        </div>

        {/* Explicit Deselect Color Button */}
        {selectedColor ? (
          <button
            onClick={() => onSetColor(null)}
            className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black border border-rose-200 shadow-2xs cursor-pointer transition active:scale-95 flex items-center gap-1"
            title="Unselect active color"
          >
            <X className="w-3.5 h-3.5" />
            <span>Deselect Color</span>
          </button>
        ) : (
          <span className="text-[10px] text-indigo-900/60 font-medium">
            Tap any paint to select
          </span>
        )}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 xl:grid-cols-12 gap-3.5">
        {COLORS.map((col) => {
          const isSelected = selectedColor ? selectedColor.toLowerCase() === col.value.toLowerCase() : false;
          
          return (
            <button
              key={col.value}
              onClick={() => {
                if (isSelected) {
                  // Unselect color when tapped again!
                  onSetColor(null);
                } else {
                  onSetColor(col.value);
                  onRestoreBrushMode(); // Restores from eraser/stamp to classic paintbrush automatically on color pick
                }
              }}
              title={isSelected ? `Click to unselect ${col.name}` : `Select ${col.name}`}
              className={`group flex flex-col items-center cursor-pointer transition-all ${
                isSelected ? "scale-[1.08]" : "hover:scale-105"
              }`}
            >
              {/* Paint Blob Circle */}
              <div
                className={`w-11 h-11 rounded-3xl shadow-md transition-all relative flex items-center justify-center ${col.bgClass} ${
                  isSelected 
                    ? "ring-4 ring-indigo-500 ring-offset-2 border-2 border-white scale-102" 
                    : "border-2 border-slate-100 group-hover:shadow-lg"
                }`}
              >
                {isSelected && (
                  <span className="text-white font-extrabold text-sm drop-shadow">🌟</span>
                )}
              </div>

              {/* Shade Name text */}
              <span className="text-[10px] font-bold text-gray-500 mt-1 block max-w-[50px] truncate leading-none text-center">
                {col.name.split(" ")[0]}
              </span>
              <span className="text-[8px] font-medium text-gray-300 block max-w-[50px] truncate leading-none text-center">
                {col.name.split(" ")[1] || ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
