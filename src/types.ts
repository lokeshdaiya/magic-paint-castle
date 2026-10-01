export type BrushType =
  | "brush"
  | "crayon"
  | "spray"
  | "rainbow"
  | "neon"
  | "sparkle"
  | "bubbles"
  | "confetti"
  | "fire"
  | "flower"
  | "cloud"
  | "eraser"
  | "stamp";

export type SymmetryType = "none" | "horizontal" | "vertical" | "kaleidoscope";

export interface ColorOption {
  value: string;
  name: string;
  bgClass: string;
  textClass: string;
}

export interface StampOption {
  id: string;
  emoji: string;
  label: string;
  scale: number;
}

export interface TemplateOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  svgPath: string; // Background outline rendered on top
  bgColor: string;  // Background base color of the page
}

export interface DrawingAction {
  points: { x: number; y: number }[];
  color: string;
  size: number;
  type: BrushType;
  symmetry: SymmetryType;
  stampId?: string;
  stampX?: number;
  stampY?: number;
}

export interface Companion {
  id: "bunny" | "owl" | "dino";
  name: string;
  avatar: string;
  voiceName: string;
  description: string;
  greeting: string;
  themeColor: string;
  borderColor: string;
  bgColor: string;
}

export interface DrawingChallenge {
  text: string;
  emoji: string;
  difficulty: "Easy 😄" | "Medium 🌟" | "Super Artsy 🎨";
}

export interface SavedDrawing {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  thumbnail: string;
  actions: DrawingAction[];
  templateId: string;
  templateName?: string;
  strokeCount: number;
  favorite?: boolean;
}
