import React, { useState } from "react";
import { SavedDrawing, DrawingAction, TemplateOption } from "../types";
import {
  X,
  Sparkles,
  Download,
  Trash2,
  Edit2,
  Check,
  Star,
  Plus,
  Clock,
  Palette,
  Search,
  FolderHeart,
  Save,
  Paintbrush
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DrawingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDrawings: SavedDrawing[];
  activeDrawingId: string | null;
  onLoadDrawing: (drawing: SavedDrawing) => void;
  onSaveCurrentToHistory: (customTitle?: string) => Promise<SavedDrawing | null>;
  onDeleteDrawing: (id: string) => void;
  onRenameDrawing: (id: string, newTitle: string) => void;
  onToggleFavorite: (id: string) => void;
  onStartNewDrawing: () => void;
  hasCurrentDrawingStrokes: boolean;
  onImportImageFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DrawingHistoryModal({
  isOpen,
  onClose,
  savedDrawings,
  activeDrawingId,
  onLoadDrawing,
  onSaveCurrentToHistory,
  onDeleteDrawing,
  onRenameDrawing,
  onToggleFavorite,
  onStartNewDrawing,
  hasCurrentDrawingStrokes,
  onImportImageFile,
}: DrawingHistoryModalProps) {
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSavingNow, setIsSavingNow] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredDrawings = savedDrawings.filter((d) => {
    if (filter === "favorites" && !d.favorite) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchTemplate = (d.templateName || "").toLowerCase().includes(q);
      return matchTitle || matchTemplate;
    }
    return true;
  });

  const favoritesCount = savedDrawings.filter((d) => d.favorite).length;

  const handleStartRename = (drawing: SavedDrawing) => {
    setEditingId(drawing.id);
    setEditingTitle(drawing.title);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenameDrawing(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleQuickSaveCurrent = async () => {
    if (!hasCurrentDrawingStrokes) return;
    setIsSavingNow(true);
    try {
      const saved = await onSaveCurrentToHistory();
      if (saved) {
        setSaveSuccessMsg(`Saved "${saved.title}" to local memory! 🌟`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      }
    } finally {
      setIsSavingNow(false);
    }
  };

  const handleDownloadDrawingImage = (drawing: SavedDrawing) => {
    if (!drawing.thumbnail) return;
    const a = document.createElement("a");
    a.href = drawing.thumbnail;
    a.download = `${drawing.title.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "masterpiece"}.png`;
    a.click();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (isToday) {
      return `Today at ${timeStr}`;
    }
    return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${timeStr}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-white/95 backdrop-blur-2xl rounded-3xl border-4 border-indigo-200/90 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-indigo-950"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-5 text-white flex items-center justify-between shadow-md relative overflow-hidden">
          {/* Whimsical sparkle circles in header background */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/15 rounded-full pointer-events-none" />
          <div className="absolute left-1/2 -top-10 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm shadow-inner flex items-center justify-center">
              <FolderHeart className="w-6 h-6 text-yellow-300 fill-yellow-300/40" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none drop-shadow-xs">
                  My Drawings & Art Book 🏰
                </h2>
                <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-xs font-black backdrop-blur-xs">
                  {savedDrawings.length} {savedDrawings.length === 1 ? "Artwork" : "Artworks"}
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-bold mt-1 flex items-center gap-1.5 opacity-90">
                <span>📂</span> Click <strong>"Open Drawing"</strong> on any piece below to load and keep painting!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all text-white cursor-pointer relative z-10"
            title="Close Art Book"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Notification Toast */}
        <AnimatePresence>
          {saveSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-emerald-500 text-white font-black text-xs px-4 py-2 text-center shadow-inner flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>{saveSuccessMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls and Search Bar */}
        <div className="p-3 sm:p-4 bg-indigo-50/70 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl shadow-xs border border-indigo-100">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-indigo-900/70 hover:text-indigo-900"
              }`}
            >
              All Drawings ({savedDrawings.length})
            </button>
            <button
              onClick={() => setFilter("favorites")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1 ${
                filter === "favorites"
                  ? "bg-amber-400 text-amber-950 shadow-xs"
                  : "text-indigo-900/70 hover:text-indigo-900"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              Favorites ({favoritesCount})
            </button>
          </div>

          {/* Search box if there are more than 3 drawings */}
          {savedDrawings.length > 2 && (
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drawings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-indigo-200/80 rounded-xl text-xs font-bold text-indigo-950 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Action buttons on the right */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Open / Import Picture from Device */}
            {onImportImageFile && (
              <label
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-white hover:bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs"
                title="Open any picture or photo from your computer or tablet to draw on"
              >
                <FolderHeart className="w-3.5 h-3.5 text-amber-600 fill-amber-600/30" />
                <span>Open Image File 🖼️</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    onImportImageFile(e);
                    onClose();
                  }}
                  className="hidden"
                />
              </label>
            )}

            {/* Save Current Canvas */}
            <button
              onClick={handleQuickSaveCurrent}
              disabled={!hasCurrentDrawingStrokes || isSavingNow}
              title={
                hasCurrentDrawingStrokes
                  ? "Save your current painting to history right now!"
                  : "Draw something on canvas first to save"
              }
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${
                hasCurrentDrawingStrokes && !isSavingNow
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white cursor-pointer active:scale-95 shadow-emerald-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingNow ? "Saving..." : "Save Current Canvas 💾"}</span>
            </button>

            {/* Start New Drawing */}
            <button
              onClick={() => {
                onStartNewDrawing();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs"
              title="Clear canvas and start a brand new artwork"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>New Drawing 📄</span>
            </button>
          </div>
        </div>

        {/* Drawings Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {filteredDrawings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-100 to-pink-100 flex items-center justify-center text-4xl shadow-inner mb-4 animate-bounce">
                {filter === "favorites" ? "⭐" : "🎨"}
              </div>
              <h3 className="text-lg font-black text-indigo-950 mb-1">
                {filter === "favorites"
                  ? "No favorite drawings yet!"
                  : searchQuery
                  ? "No drawings match your search!"
                  : "Your Art Book is waiting for drawings!"}
              </h3>
              <p className="text-xs font-bold text-indigo-900/60 max-w-sm mb-5">
                {filter === "favorites"
                  ? "Tap the star icon on any drawing to add it to your favorites collection!"
                  : searchQuery
                  ? "Try searching for a different word or clear the search box."
                  : "Draw something fun on your canvas, then tap 'Save Current Canvas 💾' to store it permanently in your browser!"}
              </p>
              {hasCurrentDrawingStrokes && (
                <button
                  onClick={handleQuickSaveCurrent}
                  disabled={isSavingNow}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Current Drawing Now ✨
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {filteredDrawings.map((drawing) => {
                const isActive = activeDrawingId === drawing.id;
                const isEditingThis = editingId === drawing.id;

                return (
                  <motion.div
                    layout
                    key={drawing.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className={`bg-white rounded-3xl p-3 border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                      isActive
                        ? "border-pink-500 ring-4 ring-pink-100"
                        : "border-indigo-100 hover:border-indigo-300"
                    }`}
                  >
                    {/* Top Thumbnail Preview */}
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200/80 group">
                      {drawing.thumbnail ? (
                        <img
                          src={drawing.thumbnail}
                          alt={drawing.title}
                          className="w-full h-full object-contain bg-white"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl font-black">
                          🎨
                        </div>
                      )}

                      {/* Active Current Badge */}
                      {isActive && (
                        <div className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-yellow-300" />
                          <span>On Canvas Now</span>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(drawing.id);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-xl cursor-pointer transition-all shadow-sm ${
                          drawing.favorite
                            ? "bg-amber-400 text-amber-950 scale-105"
                            : "bg-white/80 hover:bg-white text-slate-400 hover:text-amber-500"
                        }`}
                        title={drawing.favorite ? "Unfavorite" : "Favorite this drawing"}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            drawing.favorite ? "fill-amber-950 text-amber-950" : "fill-transparent"
                          }`}
                        />
                      </button>

                      {/* Stroke count & Template pill */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="bg-slate-900/70 text-white text-[9px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {drawing.strokeCount || drawing.actions.length} strokes
                        </span>
                        {drawing.templateName && drawing.templateName !== "Blank Canvas" && (
                          <span className="bg-indigo-900/70 text-indigo-100 text-[9px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs truncate max-w-[120px]">
                            {drawing.templateName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="mt-3 px-1 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title Row with Edit Icon */}
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5 mb-1">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(drawing.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              autoFocus
                              className="w-full text-xs font-black text-indigo-950 px-2 py-1 bg-indigo-50 border border-indigo-300 rounded-lg focus:outline-hidden"
                            />
                            <button
                              onClick={() => handleSaveRename(drawing.id)}
                              className="p-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                              title="Save title"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <h4
                              onClick={() => handleStartRename(drawing)}
                              className="font-black text-sm text-indigo-950 truncate cursor-pointer hover:text-indigo-600 flex-1"
                              title="Click to rename"
                            >
                              {drawing.title}
                            </h4>
                            <button
                              onClick={() => handleStartRename(drawing)}
                              className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer rounded-lg hover:bg-indigo-50"
                              title="Rename drawing"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-3">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(drawing.createdAt)}</span>
                        </div>
                      </div>

                      {/* Confirm Delete Banner */}
                      {confirmDeleteId === drawing.id ? (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-2.5 flex flex-col gap-2 mt-1 animate-fade-in">
                          <span className="text-[11px] font-black text-rose-800 text-center">
                            Delete this drawing?
                          </span>
                          <div className="flex items-center gap-1.5 justify-center">
                            <button
                              onClick={() => {
                                onDeleteDrawing(drawing.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer"
                            >
                              Yes, Delete 🗑️
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-black cursor-pointer"
                            >
                              Keep
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Card Actions */
                        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                          {/* Load / Open Button */}
                          <button
                            onClick={() => {
                              onLoadDrawing(drawing);
                              onClose();
                            }}
                            className={`flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs ${
                              isActive
                                ? "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300 ring-2 ring-pink-200"
                                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-200"
                            }`}
                            title="Open this drawing onto your canvas to keep painting"
                          >
                            <FolderHeart className="w-3.5 h-3.5 fill-current" />
                            <span>{isActive ? "Currently Open 🎨" : "Open Drawing 📂"}</span>
                          </button>

                          {/* Download PNG */}
                          <button
                            onClick={() => handleDownloadDrawingImage(drawing)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all"
                            title="Download PNG to your computer/tablet"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Prompt */}
                          <button
                            onClick={() => setConfirmDeleteId(drawing.id)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer active:scale-95 transition-all"
                            title="Delete from history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-indigo-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-900/70 font-bold">
            <span className="text-base">✨</span>
            <span>All drawing strokes, colors, and templates are remembered permanently in local storage!</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-900 text-white font-black hover:bg-indigo-950 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            Done 🌟
          </button>
        </div>
      </motion.div>
    </div>
  );
}
