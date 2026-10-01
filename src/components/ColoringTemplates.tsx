import React, { useState } from "react";
import { TemplateOption } from "../types";
import { TEMPLATES } from "../constants";
import { Sparkles, Palette } from "lucide-react";

interface ColoringTemplatesProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: TemplateOption) => void;
  onClearCanvas: () => void;
}

type CategoryType = "all" | "animals" | "fantasy" | "creative";

export default function ColoringTemplates({
  selectedTemplateId,
  onSelectTemplate,
  onClearCanvas,
}: ColoringTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  const categories: { id: CategoryType; label: string; icon: string }[] = [
    { id: "all", label: "All Sheets", icon: "🎨" },
    { id: "animals", label: "Cute Animals", icon: "🐾" },
    { id: "fantasy", label: "Magic & Space", icon: "✨" },
    { id: "creative", label: "Fun & Tech", icon: "🎈" },
  ];

  const getTemplateCategory = (id: string): CategoryType => {
    if (["dino", "submarine", "lion", "bunny", "puppy", "turtle"].includes(id)) {
      return "animals";
    }
    if (["unicorn", "rocket", "sweet"].includes(id)) {
      return "fantasy";
    }
    return "creative"; // butterfly, robot, blank
  };

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (selectedCategory === "all") return true;
    return getTemplateCategory(tpl.id) === selectedCategory;
  });

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl p-4 sm:p-5">
      {/* Header and counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-600" />
          <span className="text-xs font-black text-indigo-950 uppercase tracking-widest">
            Coloring Book Sheets 📖🎨
          </span>
          {selectedTemplateId !== "blank" && (
            <button
              onClick={() => onSelectTemplate(TEMPLATES[0]!)}
              className="px-2.5 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-black border border-rose-300 shadow-2xs cursor-pointer transition active:scale-95"
              title="Unselect coloring sheet and switch to blank canvas"
            >
              ✕ Deselect Sheet
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? "bg-pink-500 text-white shadow-xs scale-105"
                  : "bg-white/60 hover:bg-white text-indigo-900 border border-white/70"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
          <span className="text-[10px] text-indigo-900/60 font-black ml-1">
            ({TEMPLATES.length - 1} Sheets)
          </span>
        </div>
      </div>

      {/* Responsive Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {filteredTemplates.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;

          return (
            <button
              key={tpl.id}
              onClick={() => {
                if (isSelected && tpl.id !== "blank") {
                  // Unselect back to blank canvas when clicked again!
                  onSelectTemplate(TEMPLATES[0]!);
                } else {
                  onSelectTemplate(tpl);
                }
              }}
              title={isSelected && tpl.id !== "blank" ? `${tpl.name} is active - tap to unselect` : `Select ${tpl.name}`}
              className={`flex items-center gap-2 p-2 rounded-2xl border text-left cursor-pointer transition-all active:scale-95 ${
                isSelected
                  ? "border-pink-500 bg-white shadow-md ring-2 ring-pink-400/40 scale-[1.02]"
                  : "border-white/60 bg-white/50 hover:border-indigo-300 hover:bg-white/90 shadow-xs"
              }`}
            >
              {/* Graphic Icon bubble */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-inner transition-transform relative ${
                  isSelected ? "bg-pink-100 scale-105" : "bg-sky-50 group-hover:scale-105"
                }`}
              >
                <span>{tpl.icon}</span>
                {isSelected && tpl.id !== "blank" && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-[8px] text-white font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    ✕
                  </span>
                )}
              </div>

              {/* Title & description */}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black text-slate-800 block truncate leading-tight">
                  {tpl.name}
                </span>
                <span className="text-[9px] font-bold text-indigo-900/50 block truncate">
                  {isSelected && tpl.id !== "blank" ? "Tap to unselect" : tpl.id === "blank" ? "Clean page" : "Tap to color"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
