import { ColorOption, StampOption, TemplateOption, Companion, DrawingChallenge } from "./types";

export const COLORS: ColorOption[] = [
  { value: "#f43f5e", name: "Bubblegum Pop", bgClass: "bg-rose-500", textClass: "text-rose-500" },
  { value: "#ef4444", name: "Strawberry Splash", bgClass: "bg-red-500", textClass: "text-red-500" },
  { value: "#f97316", name: "Tangerine Dream", bgClass: "bg-orange-500", textClass: "text-orange-500" },
  { value: "#eab308", name: "Banana Sunshine", bgClass: "bg-yellow-500", textClass: "text-yellow-500" },
  { value: "#22c55e", name: "Dino Green", bgClass: "bg-green-500", textClass: "text-green-500" },
  { value: "#10b981", name: "Emerald Meadow", bgClass: "bg-emerald-500", textClass: "text-emerald-500" },
  { value: "#0ea5e9", name: "Sky Explorer", bgClass: "bg-sky-500", textClass: "text-sky-500" },
  { value: "#3b82f6", name: "Blue Bubble", bgClass: "bg-blue-500", textClass: "text-blue-500" },
  { value: "#8b5cf6", name: "Wizard Purple", bgClass: "bg-violet-500", textClass: "text-violet-500" },
  { value: "#ec4899", name: "Unicorn Pink", bgClass: "bg-pink-500", textClass: "text-pink-500" },
  { value: "#ffffff", name: "Marshmallow White", bgClass: "bg-white border-2 border-gray-300", textClass: "text-gray-400" },
  { value: "#1e293b", name: "Crayon Charcoal", bgClass: "bg-slate-800", textClass: "text-slate-800" },
];

export const STAMPS: StampOption[] = [
  { id: "star", emoji: "⭐", label: "Happy Star", scale: 1.0 },
  { id: "heart", emoji: "❤️", label: "Lovely Heart", scale: 1.0 },
  { id: "smile", emoji: "😊", label: "Giggly Face", scale: 1.0 },
  { id: "dino", emoji: "🦖", label: "Tiny Dino", scale: 1.1 },
  { id: "bunny", emoji: "🐰", label: "Fluffy Bunny", scale: 1.05 },
  { id: "unicorn", emoji: "🦄", label: "Magic Corn", scale: 1.15 },
  { id: "balloon", emoji: "🎈", label: "Fun Balloon", scale: 1.1 },
  { id: "sun", emoji: "☀️", label: "Warm Sun", scale: 1.1 },
  { id: "cloud", emoji: "☁️", label: "Soft Cloud", scale: 1.2 },
  { id: "sparkles", emoji: "✨", label: "Sparkly Magic", scale: 1.0 },
  { id: "cat", emoji: "🐱", label: "Purr Kitty", scale: 1.05 },
  { id: "dog", emoji: "🐶", label: "Playful Pup", scale: 1.05 },
  { id: "rocket", emoji: "🚀", label: "Fast Rocket", scale: 1.15 },
  { id: "flower", emoji: "🌸", label: "Pretty Flower", scale: 1.0 },
  { id: "cupcake", emoji: "🧁", label: "Yummy Sweet", scale: 1.05 },
  { id: "rainbow", emoji: "🌈", label: "Sky Ribbon", scale: 1.3 },
];

export const COMPANIONS: Companion[] = [
  {
    id: "bunny",
    name: "Bella Bunny",
    avatar: "🐰",
    voiceName: "Bella",
    description: "An energetic, cheerful bunny with wiggly ears!",
    greeting: "Hi there, creative superstar! *hops around* I'm super excited to draw funny things with you today! Press my carrot button to show me your coloring!",
    themeColor: "from-pink-400 to-rose-400 font-bold",
    borderColor: "border-pink-300 shadow-pink-200",
    bgColor: "bg-pink-50"
  },
  {
    id: "owl",
    name: "Ollie Owl",
    avatar: "🦉",
    voiceName: "Ollie",
    description: "A wise, curious owl who loves shapes and astronomy!",
    greeting: "Whoo-whoo! Greetings, young scientist-artist! *flaps beautiful wings* I am Ollie! Let's conjure cosmic shapes and starry paints on our canvas!",
    themeColor: "from-emerald-400 to-teal-400 font-bold",
    borderColor: "border-emerald-300 shadow-emerald-200",
    bgColor: "bg-emerald-50"
  },
  {
    id: "dino",
    name: "Dexter Dino",
    avatar: "🦖",
    voiceName: "Dexter",
    description: "A happy baby dinosaur who loves green things and giant stomps!",
    greeting: "Roarrr! Stomp stomp stomp! *wiggles tail* I'm Dexter! Let's fill the screen with yummy strawberry colors and gigantic monsters! It's going to be roar-some!",
    themeColor: "from-amber-400 to-orange-400 font-bold",
    borderColor: "border-amber-300 shadow-amber-200",
    bgColor: "bg-amber-50"
  },
];

export const CHALLENGES: DrawingChallenge[] = [
  { text: "Draw a happy smiling sun eating a big slice of watermelon!", emoji: "🍉☀️", difficulty: "Easy 😄" },
  { text: "Draw a cute little puppy floating in a bucket with colorful balloons!", emoji: "🐶🎈", difficulty: "Medium 🌟" },
  { text: "Draw a magical rocket ship landing on a planet made entirely of pink cotton candy!", emoji: "🚀🪐", difficulty: "Super Artsy 🎨" },
  { text: "Draw a baby dinosaur wearing a golden crown and a wizard cape!", emoji: "🦖👑", difficulty: "Easy 😄" },
  { text: "Draw your favorite animal swimming happily deep underwater wearing snorkel goggles!", emoji: "🐠🤿", difficulty: "Medium 🌟" },
  { text: "Draw a candy palace with lollipop trees and chocolate rivers!", emoji: "🍭🏰", difficulty: "Super Artsy 🎨" },
  { text: "Draw a happy smiling ghost playing on a wooden swingset!", emoji: "👻🎡", difficulty: "Easy 😄" },
  { text: "Draw an alien pilot wave hello from inside a glowing turquoise flying saucer!", emoji: "👽🛸", difficulty: "Medium 🌟" },
  { text: "Draw a family of friendly ladybugs having a small picnic on a clover leaf!", emoji: "🐞🍀", difficulty: "Super Artsy 🎨" }
];

export const TEMPLATES: TemplateOption[] = [
  {
    id: "blank",
    name: "Blank Canvas",
    icon: "📄",
    description: "A fresh blank page to draw whatever your heart desires!",
    bgColor: "#f8fafc",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <!-- Minimal border guidelines just for fun -->
        <rect x="15" y="15" width="770" height="570" rx="15" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-dasharray="8 8" />
      </svg>
    `
  },
  {
    id: "dino",
    name: "Dino Friend",
    icon: "🦖",
    description: "Color in this friendly little dinosaur baby who loves plants!",
    bgColor: "#fefefe",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Dinosaur Body -->
          <path d="M 120 400 
                   Q 120 180, 280 180 
                   Q 400 180, 480 200 
                   Q 560 220, 600 350 
                   Q 640 480, 500 500
                   Q 400 510, 300 500
                   Q 150 490, 120 400 Z" stroke="#334155" />
          <!-- Tail -->
          <path d="M 500 500 C 650 480, 720 380, 750 350 C 700 420, 580 480, 510 495" stroke="#334155" />
          <!-- Head/Muzzle -->
          <path d="M 170 300 C 100 300, 80 240, 100 200 C 120 160, 240 160, 240 250" />
          <!-- Back Spikes -->
          <path d="M 270 180 L 290 145 L 310 180" />
          <path d="M 340 180 L 360 145 L 380 180" />
          <path d="M 410 185 L 430 150 L 450 188" />
          <path d="M 470 195 L 490 160 L 510 200" />
          <!-- Big Eye -->
          <circle cx="160" cy="220" r="16" fill="#1e293b" />
          <circle cx="155" cy="215" r="5" fill="#ffffff" />
          <path d="M 145 198 Q 160 190, 175 198" stroke-width="6" />
          <!-- Cheerful Smile -->
          <path d="M 110 245 Q 140 280, 170 245" />
          <!-- Rosy Cheek (for outline visualization) -->
          <ellipse cx="190" cy="250" rx="10" ry="6" stroke-width="4" stroke-dasharray="3 3 M 190 250" />
          <!-- Happy Tiny Arm -->
          <path d="M 230 350 Q 180 340, 170 365" />
          <path d="M 230 350 L 210 380" />
          <!-- Cute feet -->
          <path d="M 200 480 C 200 540, 260 540, 260 485" />
          <path d="M 400 490 C 400 550, 460 550, 460 490" />
          <!-- Ground Grass -->
          <path d="M 50 530 L 750 530" stroke="#64748b" stroke-width="6" />
          <path d="M 120 530 L 130 510 L 140 530" stroke-width="6" />
          <path d="M 620 530 L 635 500 L 650 530" stroke-width="6" />
          <!-- Bubble Cloud -->
          <path d="M 580 110 C 600 80, 660 80, 680 110 C 700 110, 720 130, 710 150 C 680 180, 580 180, 560 150 Z" stroke="#cbd5e1" stroke-width="6" />
        </g>
      </svg>
    `
  },
  {
    id: "rocket",
    name: "Space Rocket",
    icon: "🚀",
    description: "Launch this chubby spaceship through twinkling stars and funny planets!",
    bgColor: "#fcfcff",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Rocket Body Cone -->
          <path d="M 330 350 
                   Q 330 180, 400 70 
                   Q 470 180, 470 350 Z" />
          <!-- Rocket Tail fins -->
          <path d="M 330 300 Q 250 340, 230 390 L 330 360" />
          <path d="M 470 300 Q 550 340, 570 390 L 470 360" />
          <path d="M 370 350 L 370 390 C 370 410, 430 410, 430 390 L 430 350" />
          <!-- Thick Engine Nozzle -->
          <path d="M 350 360 L 450 360" />
          <!-- Playful Fire Trail -->
          <path d="M 360 375 L 340 480 L 390 420 L 430 460 L 415 375" stroke="#ff8a00" stroke-width="10" />
          <!-- Window -->
          <circle cx="400" cy="220" r="30" fill="none" />
          <!-- Happy Astronaut Face in Window (chubby smiley) -->
          <circle cx="400" cy="220" r="20" stroke-width="4" stroke-dasharray="2 2" />
          <circle cx="390" cy="216" r="3.5" fill="#1e293b" />
          <circle cx="410" cy="216" r="3.5" fill="#1e293b" />
          <path d="M 393 224 Q 400 230, 407 224" stroke-width="4" />
          <!-- Big Cute Moon in corner -->
          <circle cx="650" cy="150" r="70" />
          <!-- Moon Craters -->
          <circle cx="610" cy="110" r="10" stroke-width="8" />
          <circle cx="675" cy="190" r="14" stroke-width="8" />
          <!-- Small Twinkle Stars -->
          <path d="M 120 120 L 125 135 L 140 140 L 125 145 L 120 160 L 115 145 L 100 140 L 115 135 Z" stroke="#e2e8f0" stroke-width="6" />
          <path d="M 200 480 L 202 490 L 212 492 L 202 494 L 200 504 L 198 494 L 188 492 L 198 490 Z" stroke="#e2e8f0" stroke-width="6" />
          <path d="M 680 430 L 684 445 L 699 448 L 684 451 L 680 466 L 676 451 L 661 448 L 676 445 Z" stroke="#e2e8f0" stroke-width="6" />
        </g>
      </svg>
    `
  },
  {
    id: "sweet",
    name: "Candy Castle",
    icon: "🏰",
    description: "Paint a candy fortress of soft ice-cream cones, candy trees, and sweet cream slides!",
    bgColor: "#fffdfd",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Main Castle Walls -->
          <path d="M 280 450 L 520 450 L 520 280 L 460 280 L 460 320 L 420 320 L 420 280 L 380 280 L 380 320 L 340 320 L 340 280 L 280 280 Z" />
          <!-- Castle central gate/door -->
          <path d="M 360 450 L 360 370 C 360 330, 440 330, 440 370 L 440 450" />
          <!-- Left ice cream cone tower -->
          <path d="M 220 450 L 280 450 L 280 220 L 220 220 Z" />
          <path d="M 210 220 L 290 220 L 250 120 Z" stroke="#eab308" /> <!-- Cone hat -->
          <path d="M 215 220 Q 250 240, 285 220" stroke-width="6" /> <!-- dripping cream -->
          <!-- Right ice cream cone tower -->
          <path d="M 520 450 L 580 450 L 580 220 L 520 220 Z" />
          <path d="M 510 220 L 590 220 L 550 120 Z" stroke="#eab308" /> <!-- Cone hat -->
          <path d="M 515 220 Q 550 240, 585 220" stroke-width="6" /> <!-- dripping cream -->
          <!-- Flags on towers -->
          <path d="M 250 120 L 250 70 L 210 90 L 250 110" />
          <path d="M 550 120 L 550 70 L 510 90 L 550 110" />
          <!-- Yummy frosting dots on tower hats -->
          <circle cx="210" cy="90" r="6" fill="#1e293b" />
          <circle cx="510" cy="90" r="6" fill="#1e293b" />
          <!-- Cupcake Tree left -->
          <path d="M 120 450 L 120 380" stroke-width="16" />
          <path d="M 80 380 C 80 330, 160 330, 160 380 Z" stroke="#f43f5e" />
          <!-- Gumdrop cloud right -->
          <circle cx="680" cy="380" r="28" />
          <circle cx="720" cy="380" r="24" />
          <circle cx="650" cy="400" r="20" />
          <path d="M 630 420 L 740 420" />
        </g>
      </svg>
    `
  },
  {
    id: "submarine",
    name: "Happy Shark",
    icon: "🦈",
    description: "Discover a lovely marine theme with coral reef, starfish, and bubbles!",
    bgColor: "#f8fdff",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Shark/Big fish body shape -->
          <path d="M 180 300 
                   C 180 180, 480 120, 550 220
                   C 580 260, 680 230, 720 200
                   C 700 270, 720 330, 740 370
                   C 660 330, 560 340, 500 370
                   C 360 410, 180 380, 180 300 Z" />
          <!-- Big smiling shark mouth -->
          <path d="M 210 330 Q 330 380, 310 290" />
          <!-- Cartoon pointy teeth -->
          <path d="M 230 338 L 240 350 L 250 343 L 260 353 L 270 343 M 230 338 Z" stroke-width="6" fill="none" />
          <!-- Googly Eye -->
          <circle cx="280" cy="220" r="18" fill="none" />
          <circle cx="280" cy="220" r="8" fill="#1e293b" />
          <circle cx="276" cy="216" r="3.5" fill="#ffffff" />
          <!-- Back fin -->
          <path d="M 400 190 C 420 100, 480 80, 480 150 C 480 200, 440 215, 420 215" />
          <!-- Side Fin -->
          <path d="M 440 320 C 440 370, 390 410, 370 390 C 350 370, 400 330, 430 325" />
          <!-- Starfish on Ocean Bed -->
          <path d="M 140 480 
                   L 155 490 L 150 510 L 165 500 L 180 510 L 175 490 L 190 480 L 170 480 L 165 460 L 160 480 Z" stroke="#ea580c" />
          <!-- Seaweed -->
          <path d="M 80 520 Q 100 440, 70 380 Q 90 320, 80 270" stroke="#16a34a" />
          <path d="M 110 520 Q 80 460, 110 400 Q 90 340, 120 300" stroke="#16a34a" fill="none" />
          <!-- Little bubbles floating up -->
          <circle cx="250" cy="140" r="14" stroke="#abc7f5" stroke-width="6" />
          <circle cx="300" cy="100" r="8" stroke="#abc7f5" stroke-width="6" />
          <circle cx="280" cy="70" r="5" stroke="#abc7f5" stroke-width="4" />
          <!-- Ocean Bed sand line -->
          <path d="M 30 520 L 770 520" stroke-width="8" stroke-dasharray="1 1" />
        </g>
      </svg>
    `
  },
  {
    id: "unicorn",
    name: "Magic Unicorn",
    icon: "🦄",
    description: "Color a fabulous unicorn with flowing rainbow hair, sparkly horn, and twinkling stars!",
    bgColor: "#fff9fc",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Unicorn Head & Neck -->
          <path d="M 260 520 C 260 410, 270 330, 360 250 C 410 210, 520 220, 580 280 C 620 320, 600 390, 530 420 C 470 440, 420 400, 380 430 C 350 460, 350 520, 350 520" />
          <!-- Muzzle & Mouth -->
          <path d="M 580 280 C 650 320, 640 400, 560 410" />
          <path d="M 590 360 Q 560 380, 540 360" stroke-width="8" />
          <circle cx="590" cy="330" r="6" fill="#1e293b" />
          <!-- Big Eye with Eyelashes -->
          <circle cx="480" cy="300" r="20" />
          <circle cx="480" cy="300" r="10" fill="#1e293b" />
          <circle cx="475" cy="295" r="4" fill="#ffffff" />
          <path d="M 465 280 L 455 265 M 480 275 L 480 260 M 495 280 L 505 265" stroke-width="6" />
          <!-- Cute Cheek Blush -->
          <circle cx="510" cy="360" r="12" stroke-dasharray="4 4" stroke-width="4" />
          <!-- Unicorn Horn with Spiral Ridges -->
          <path d="M 430 220 L 490 60 L 475 210" stroke="#f59e0b" stroke-width="14" />
          <path d="M 445 180 L 480 160 M 455 140 L 485 120 M 465 100 L 490 80" stroke="#f59e0b" stroke-width="8" />
          <!-- Ear -->
          <path d="M 370 240 C 370 170, 410 180, 420 225" />
          <path d="M 385 230 C 385 195, 405 200, 410 225" stroke-width="6" />
          <!-- Flowing Mane locks -->
          <path d="M 360 250 C 270 250, 220 310, 260 360" stroke="#ec4899" />
          <path d="M 320 320 C 220 350, 180 430, 240 460" stroke="#a855f7" />
          <path d="M 280 390 C 190 420, 160 500, 230 520" stroke="#3b82f6" />
          <!-- Rainbow in Sky -->
          <path d="M 60 240 C 120 120, 260 120, 320 200" stroke="#f43f5e" stroke-width="10" />
          <path d="M 75 250 C 130 145, 250 145, 305 215" stroke="#f59e0b" stroke-width="10" />
          <path d="M 90 260 C 140 170, 240 170, 290 230" stroke="#10b981" stroke-width="10" />
          <!-- Sparkle Stars -->
          <path d="M 680 140 L 685 160 L 705 165 L 685 170 L 680 190 L 675 170 L 655 165 L 675 160 Z" stroke="#eab308" stroke-width="6" />
          <path d="M 620 220 L 623 232 L 635 235 L 623 238 L 620 250 L 617 238 L 605 235 L 617 232 Z" stroke="#eab308" stroke-width="6" />
          <path d="M 160 100 L 163 112 L 175 115 L 163 118 L 160 130 L 157 118 L 145 115 L 157 112 Z" stroke="#eab308" stroke-width="6" />
          <!-- Fluffy Cloud -->
          <path d="M 40 280 C 40 250, 80 250, 95 270 C 115 250, 165 260, 165 290 C 185 300, 175 330, 150 340 C 130 350, 50 350, 40 320 Z" stroke="#cbd5e1" stroke-width="8" />
        </g>
      </svg>
    `
  },
  {
    id: "lion",
    name: "Sunny Lion",
    icon: "🦁",
    description: "Roar with a joyful king of the jungle surrounded by sunbeams and tropical vines!",
    bgColor: "#fffdf5",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Big Fluffy Sun Mane Petals -->
          <path d="M 400 130 C 330 70, 240 120, 250 200 C 180 180, 160 270, 200 320 C 160 360, 200 440, 270 430 C 270 500, 360 520, 400 480 C 440 520, 530 500, 530 430 C 600 440, 640 360, 600 320 C 640 270, 620 180, 550 200 C 560 120, 470 70, 400 130 Z" stroke="#f59e0b" stroke-width="14" />
          <!-- Head -->
          <circle cx="400" cy="300" r="130" />
          <!-- Ears -->
          <path d="M 280 220 C 250 180, 310 160, 320 200" />
          <path d="M 520 220 C 550 180, 490 160, 480 200" />
          <!-- Inner Ears -->
          <circle cx="300" cy="195" r="10" stroke-width="6" />
          <circle cx="500" cy="195" r="10" stroke-width="6" />
          <!-- Big Cartoon Eyes -->
          <circle cx="350" cy="280" r="18" />
          <circle cx="350" cy="280" r="9" fill="#1e293b" />
          <circle cx="346" cy="276" r="3.5" fill="#ffffff" />
          <circle cx="450" cy="280" r="18" />
          <circle cx="450" cy="280" r="9" fill="#1e293b" />
          <circle cx="446" cy="276" r="3.5" fill="#ffffff" />
          <!-- Eyebrows -->
          <path d="M 335 250 Q 350 240, 365 250" stroke-width="8" />
          <path d="M 435 250 Q 450 240, 465 250" stroke-width="8" />
          <!-- Cute Nose -->
          <path d="M 380 320 L 420 320 L 400 345 Z" fill="#1e293b" stroke-width="6" />
          <!-- Cheerful Lion Smile -->
          <path d="M 400 345 L 400 365 C 380 380, 350 375, 350 355" />
          <path d="M 400 365 C 420 380, 450 375, 450 355" />
          <!-- Whiskers -->
          <path d="M 320 340 L 260 330 M 320 355 L 255 360" stroke-width="6" />
          <path d="M 480 340 L 540 330 M 480 355 L 545 360" stroke-width="6" />
          <!-- Paws -->
          <path d="M 330 430 L 330 520 C 330 545, 370 545, 370 520 L 370 470" />
          <path d="M 470 430 L 470 520 C 470 545, 430 545, 430 520 L 430 470" />
          <!-- Back Paws -->
          <path d="M 280 520 C 260 520, 260 480, 310 470" />
          <path d="M 520 520 C 540 520, 540 480, 490 470" />
          <!-- Tail with fluffy tuft -->
          <path d="M 510 480 C 600 500, 660 440, 650 370 C 630 350, 680 320, 670 360 Z" stroke="#f59e0b" stroke-width="12" />
          <!-- Leaves in corner -->
          <path d="M 60 540 C 60 450, 150 440, 180 500" stroke="#16a34a" stroke-width="10" />
          <path d="M 80 540 C 120 400, 220 420, 200 520" stroke="#16a34a" stroke-width="10" />
          <!-- Sun in sky -->
          <circle cx="700" cy="110" r="45" stroke="#f59e0b" stroke-width="10" />
          <path d="M 700 45 L 700 25 M 765 110 L 785 110 M 700 175 L 700 195 M 635 110 L 615 110 M 745 65 L 760 50 M 745 155 L 760 170 M 655 65 L 640 50 M 655 155 L 640 170" stroke="#f59e0b" stroke-width="6" />
        </g>
      </svg>
    `
  },
  {
    id: "bunny",
    name: "Garden Bunny",
    icon: "🐰",
    description: "Paint a fluffy bunny in a flower meadow holding a giant crunchy carrot!",
    bgColor: "#fefcff",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Bunny Tall Ears -->
          <path d="M 320 200 C 300 60, 360 40, 370 180" />
          <path d="M 330 180 C 320 90, 350 70, 355 170" stroke-width="6" />
          <path d="M 430 180 C 440 40, 500 60, 480 200" />
          <path d="M 445 170 C 450 70, 480 90, 470 180" stroke-width="6" />
          <!-- Chubby Head -->
          <path d="M 300 260 C 260 320, 320 400, 400 400 C 480 400, 540 320, 500 260 C 480 200, 320 200, 300 260 Z" />
          <!-- Big Eyes -->
          <circle cx="355" cy="275" r="16" />
          <circle cx="355" cy="275" r="8" fill="#1e293b" />
          <circle cx="352" cy="272" r="3" fill="#ffffff" />
          <circle cx="445" cy="275" r="16" />
          <circle cx="445" cy="275" r="8" fill="#1e293b" />
          <circle cx="442" cy="272" r="3" fill="#ffffff" />
          <!-- Twitchy Nose & Mouth -->
          <path d="M 390 310 L 410 310 L 400 322 Z" fill="#ec4899" stroke-width="4" />
          <path d="M 400 322 L 400 338 C 385 348, 370 340, 370 330" />
          <path d="M 400 338 C 415 348, 430 340, 430 330" />
          <!-- Whiskers -->
          <path d="M 330 315 L 260 310 M 330 330 L 255 335" stroke-width="6" />
          <path d="M 470 315 L 540 310 M 470 330 L 545 335" stroke-width="6" />
          <!-- Giant Crunchy Carrot being held -->
          <path d="M 320 420 L 520 460 C 540 465, 550 490, 530 500 L 260 480 C 240 475, 240 445, 260 435 Z" stroke="#f97316" stroke-width="14" />
          <!-- Carrot ridges -->
          <path d="M 350 440 L 370 455 M 420 450 L 440 470 M 470 465 L 485 480" stroke="#ea580c" stroke-width="6" />
          <!-- Carrot leafy greens -->
          <path d="M 530 475 C 600 450, 620 410, 580 430 C 640 420, 650 460, 600 470 C 660 480, 620 520, 570 490" stroke="#16a34a" stroke-width="10" />
          <!-- Front Paws holding carrot -->
          <circle cx="340" cy="425" r="22" stroke-width="10" />
          <circle cx="450" cy="445" r="22" stroke-width="10" />
          <!-- Sitting Feet -->
          <path d="M 280 520 C 240 520, 240 470, 300 470" />
          <path d="M 480 520 C 520 520, 520 470, 460 470" />
          <!-- Daisies in Grass -->
          <circle cx="150" cy="480" r="14" stroke="#f59e0b" stroke-width="8" />
          <path d="M 150 450 C 130 450, 130 470, 150 470 C 170 470, 170 450, 150 450 Z M 150 490 C 130 490, 130 510, 150 510 C 170 510, 170 490, 150 490 Z M 120 480 C 120 460, 140 460, 140 480 C 140 500, 120 500, 120 480 Z M 160 480 C 160 460, 180 460, 180 480 C 180 500, 160 500, 160 480 Z" stroke="#94a3b8" stroke-width="6" />
          <path d="M 150 510 L 150 550" stroke="#16a34a" stroke-width="8" />
          <!-- Butterfly in Air -->
          <path d="M 660 200 C 690 170, 710 210, 675 220 C 710 230, 680 270, 660 240 C 640 270, 610 230, 645 220 C 610 210, 630 170, 660 200 Z" stroke="#ec4899" stroke-width="8" />
          <path d="M 660 195 L 660 245" stroke="#1e293b" stroke-width="6" />
          <!-- Ground meadow line -->
          <path d="M 40 530 L 760 530" stroke="#64748b" stroke-width="8" />
        </g>
      </svg>
    `
  },
  {
    id: "butterfly",
    name: "Flutter Butterfly",
    icon: "🦋",
    description: "Fill this giant butterfly with dazzling symmetrical patterns and blooming flowers!",
    bgColor: "#fcfffd",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Butterfly Center Body -->
          <ellipse cx="400" cy="300" rx="22" ry="110" />
          <!-- Butterfly Head -->
          <circle cx="400" cy="165" r="32" />
          <!-- Spiral Antennae -->
          <path d="M 385 140 C 350 90, 310 110, 330 140" stroke-width="8" />
          <circle cx="330" cy="140" r="8" fill="#1e293b" />
          <path d="M 415 140 C 450 90, 490 110, 470 140" stroke-width="8" />
          <circle cx="470" cy="140" r="8" fill="#1e293b" />
          <!-- Cute Face -->
          <circle cx="390" cy="160" r="5" fill="#1e293b" />
          <circle cx="410" cy="160" r="5" fill="#1e293b" />
          <path d="M 392 175 Q 400 185, 408 175" stroke-width="6" />
          <!-- Left Top Wing -->
          <path d="M 380 230 C 260 120, 100 160, 110 300 C 120 370, 240 370, 380 320" />
          <!-- Left Bottom Wing -->
          <path d="M 380 330 C 240 390, 140 450, 180 520 C 220 570, 330 520, 380 400" />
          <!-- Right Top Wing -->
          <path d="M 420 230 C 540 120, 700 160, 690 300 C 680 370, 560 370, 420 320" />
          <!-- Right Bottom Wing -->
          <path d="M 420 330 C 560 390, 660 450, 620 520 C 580 570, 470 520, 420 400" />
          <!-- Left Wing Patterns -->
          <circle cx="230" cy="250" r="35" stroke="#f43f5e" stroke-width="10" />
          <circle cx="230" cy="250" r="16" stroke="#f43f5e" stroke-width="6" />
          <path d="M 160 320 C 190 310, 230 330, 200 355" stroke="#3b82f6" stroke-width="8" />
          <circle cx="260" cy="460" r="24" stroke="#eab308" stroke-width="10" />
          <!-- Right Wing Patterns -->
          <circle cx="570" cy="250" r="35" stroke="#f43f5e" stroke-width="10" />
          <circle cx="570" cy="250" r="16" stroke="#f43f5e" stroke-width="6" />
          <path d="M 640 320 C 610 310, 570 330, 600 355" stroke="#3b82f6" stroke-width="8" />
          <circle cx="540" cy="460" r="24" stroke="#eab308" stroke-width="10" />
          <!-- Flower 1 Left -->
          <circle cx="90" cy="510" r="18" stroke="#f59e0b" stroke-width="10" />
          <path d="M 90 530 L 90 570" stroke="#16a34a" stroke-width="10" />
          <!-- Flower 2 Right -->
          <circle cx="710" cy="510" r="18" stroke="#f59e0b" stroke-width="10" />
          <path d="M 710 530 L 710 570" stroke="#16a34a" stroke-width="10" />
          <!-- Twinkling stars -->
          <path d="M 230 90 L 235 105 L 250 110 L 235 115 L 230 130 L 225 115 L 210 110 L 225 105 Z" stroke="#e2e8f0" stroke-width="6" />
          <path d="M 570 90 L 575 105 L 590 110 L 575 115 L 570 130 L 565 115 L 550 110 L 565 105 Z" stroke="#e2e8f0" stroke-width="6" />
        </g>
      </svg>
    `
  },
  {
    id: "puppy",
    name: "Playful Puppy",
    icon: "🐶",
    description: "Color a waggy puppy with floppy ears resting paws on a big bouncy ball!",
    bgColor: "#fffcf7",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Puppy Floppy Ears -->
          <path d="M 260 220 C 180 180, 160 330, 230 380 C 260 380, 270 310, 270 260" stroke="#78350f" />
          <path d="M 540 220 C 620 180, 640 330, 570 380 C 540 380, 530 310, 530 260" stroke="#78350f" />
          <!-- Puppy Head -->
          <circle cx="400" cy="270" r="140" />
          <!-- Puppy Patch over one eye -->
          <path d="M 310 220 C 310 170, 390 170, 390 230 C 390 290, 300 280, 310 220 Z" stroke="#b45309" stroke-width="8" />
          <!-- Big Shiny Eyes -->
          <circle cx="345" cy="245" r="18" />
          <circle cx="345" cy="245" r="9" fill="#1e293b" />
          <circle cx="341" cy="241" r="3.5" fill="#ffffff" />
          <circle cx="455" cy="245" r="18" />
          <circle cx="455" cy="245" r="9" fill="#1e293b" />
          <circle cx="451" cy="241" r="3.5" fill="#ffffff" />
          <!-- Button Nose -->
          <ellipse cx="400" cy="290" rx="22" ry="16" fill="#1e293b" />
          <!-- Smiling Mouth with Tongue Out -->
          <path d="M 400 306 L 400 330 C 380 345, 360 340, 350 325" />
          <path d="M 400 330 C 420 345, 440 340, 450 325" />
          <path d="M 385 332 C 385 370, 415 370, 415 332 Z" fill="#f43f5e" stroke="#e11d48" stroke-width="8" />
          <!-- Collar with Heart Tag -->
          <path d="M 310 390 Q 400 425, 490 390" stroke="#ef4444" stroke-width="16" />
          <path d="M 400 415 L 390 435 Q 400 455, 410 435 Z" fill="#eab308" stroke="#ca8a04" stroke-width="6" />
          <!-- Body & Paws on Play Ball -->
          <path d="M 300 420 L 280 500" />
          <path d="M 500 420 L 520 500" />
          <!-- Big Bouncy Ball in center -->
          <circle cx="400" cy="485" r="55" stroke="#3b82f6" stroke-width="12" />
          <path d="M 350 485 Q 400 450, 450 485" stroke="#ec4899" stroke-width="8" />
          <!-- Front paws resting on ball -->
          <ellipse cx="360" cy="445" rx="25" ry="18" stroke-width="10" />
          <ellipse cx="440" cy="445" rx="25" ry="18" stroke-width="10" />
          <!-- Wagging Tail -->
          <path d="M 520 480 C 620 470, 650 380, 610 390" stroke="#78350f" stroke-width="14" />
          <!-- Tasty Dog Bone on Grass -->
          <path d="M 170 510 C 150 490, 130 520, 150 530 C 130 540, 150 570, 170 550 L 210 550 C 230 570, 250 540, 230 530 C 250 520, 230 490, 210 510 Z" stroke="#e2e8f0" stroke-width="8" />
          <!-- Ground line -->
          <path d="M 40 540 L 760 540" stroke="#64748b" stroke-width="8" />
        </g>
      </svg>
    `
  },
  {
    id: "robot",
    name: "Beep Robot",
    icon: "🤖",
    description: "Paint a retro friendly robot with antenna lights, gears, dials, and a heart monitor!",
    bgColor: "#f7faff",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Robot Antenna -->
          <path d="M 400 130 L 400 70" stroke-width="10" />
          <circle cx="400" cy="60" r="16" fill="#eab308" stroke="#ca8a04" stroke-width="8" />
          <path d="M 370 60 L 360 50 M 430 60 L 440 50" stroke="#f59e0b" stroke-width="6" />
          <!-- Robot TV Head with rounded corners -->
          <rect x="290" y="130" width="220" height="150" rx="30" />
          <!-- Screen inner border -->
          <rect x="315" y="155" width="170" height="100" rx="18" stroke="#94a3b8" stroke-width="8" />
          <!-- Round Eyes with pupil crossbars -->
          <circle cx="360" cy="195" r="18" fill="#38bdf8" />
          <circle cx="440" cy="195" r="18" fill="#38bdf8" />
          <!-- Cheerful Pixel Smile -->
          <path d="M 370 230 L 380 238 L 420 238 L 430 230" stroke-width="8" />
          <!-- Neck with bolts -->
          <rect x="375" y="280" width="50" height="25" stroke-width="8" />
          <!-- Robot Box Body -->
          <rect x="270" y="305" width="260" height="190" rx="25" />
          <!-- Glowing Heart meter in chest -->
          <path d="M 340 350 C 340 330, 365 330, 375 345 C 385 330, 410 330, 410 350 C 410 375, 375 395, 375 395 C 375 395, 340 375, 340 350 Z" stroke="#ef4444" stroke-width="8" fill="#fecdd3" />
          <!-- Control Knobs / Buttons -->
          <circle cx="450" cy="350" r="14" stroke="#10b981" stroke-width="8" />
          <circle cx="450" cy="385" r="14" stroke="#eab308" stroke-width="8" />
          <circle cx="450" cy="420" r="14" stroke="#3b82f6" stroke-width="8" />
          <!-- Horizontal Meter Grid -->
          <rect x="315" y="425" width="100" height="40" rx="8" stroke="#64748b" stroke-width="6" />
          <path d="M 335 425 L 335 465 M 365 425 L 365 465 M 395 425 L 395 465" stroke="#94a3b8" stroke-width="6" />
          <!-- Waving Accordion Arms -->
          <path d="M 270 330 Q 180 300, 160 250" stroke-width="14" />
          <!-- Claw Hand Left -->
          <path d="M 160 250 C 130 230, 130 190, 160 210 C 190 190, 190 230, 160 250" stroke-width="8" />
          <!-- Right Arm resting -->
          <path d="M 530 330 Q 620 360, 640 420" stroke-width="14" />
          <!-- Claw Hand Right -->
          <path d="M 640 420 C 670 410, 680 450, 650 450" stroke-width="8" />
          <!-- Sturdy Feet -->
          <rect x="320" y="495" width="50" height="45" rx="10" />
          <rect x="430" y="495" width="50" height="45" rx="10" />
          <path d="M 300 540 L 390 540 M 410 540 L 500 540" stroke-width="12" />
          <!-- Little Floating Gears -->
          <circle cx="670" cy="180" r="28" stroke="#cbd5e1" stroke-width="8" />
          <circle cx="670" cy="180" r="10" stroke="#94a3b8" stroke-width="6" />
          <circle cx="150" cy="420" r="22" stroke="#cbd5e1" stroke-width="8" />
          <circle cx="150" cy="420" r="8" stroke="#94a3b8" stroke-width="6" />
        </g>
      </svg>
    `
  },
  {
    id: "turtle",
    name: "Sea Turtle",
    icon: "🐢",
    description: "Glide under the sea with a gentle sea turtle, dancing corals, and jellyfish!",
    bgColor: "#f4fcff",
    svgPath: `
      <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1e293b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Big Turtle Oval Shell -->
          <ellipse cx="400" cy="310" rx="160" ry="120" stroke="#16a34a" stroke-width="16" />
          <!-- Turtle Shell Hexagonal / Curved Plates -->
          <path d="M 400 210 L 460 250 L 460 330 L 400 370 L 340 330 L 340 250 Z" stroke="#15803d" stroke-width="10" />
          <path d="M 340 250 L 270 240 M 460 250 L 530 240 M 460 330 L 540 340 M 400 370 L 400 430 M 340 330 L 260 340 M 400 210 L 400 190" stroke="#15803d" stroke-width="8" />
          <!-- Turtle Smiling Head -->
          <path d="M 550 280 C 650 260, 680 340, 580 360" stroke="#22c55e" stroke-width="14" />
          <!-- Head Eyes -->
          <circle cx="610" cy="290" r="12" />
          <circle cx="610" cy="290" r="6" fill="#1e293b" />
          <circle cx="608" cy="288" r="2.5" fill="#ffffff" />
          <!-- Gentle Smile -->
          <path d="M 610 325 Q 630 330, 645 320" stroke-width="6" />
          <!-- Front Swimming Flippers -->
          <path d="M 460 200 C 500 100, 620 90, 640 160 C 620 220, 520 230, 480 230" stroke="#22c55e" stroke-width="14" />
          <path d="M 460 410 C 500 510, 620 520, 640 450 C 620 390, 520 380, 480 380" stroke="#22c55e" stroke-width="14" />
          <!-- Back Paddles -->
          <path d="M 280 230 C 230 190, 180 210, 200 260 C 220 280, 260 270, 270 260" stroke="#22c55e" stroke-width="12" />
          <path d="M 280 390 C 230 430, 180 410, 200 360 C 220 340, 260 350, 270 360" stroke="#22c55e" stroke-width="12" />
          <!-- Cute Tail -->
          <path d="M 240 310 L 190 310" stroke="#22c55e" stroke-width="12" />
          <!-- Floating Jellyfish friend in corner -->
          <path d="M 120 160 C 120 120, 180 120, 180 160 Z" stroke="#ec4899" stroke-width="8" />
          <path d="M 130 160 Q 135 190, 130 220 M 150 160 Q 155 195, 150 225 M 170 160 Q 175 190, 170 220" stroke="#f472b6" stroke-width="6" />
          <!-- Underwater Sea Bubbles -->
          <circle cx="680" cy="180" r="14" stroke="#60a5fa" stroke-width="6" />
          <circle cx="710" cy="130" r="10" stroke="#60a5fa" stroke-width="6" />
          <circle cx="690" cy="90" r="6" stroke="#60a5fa" stroke-width="4" />
          <circle cx="300" cy="120" r="12" stroke="#60a5fa" stroke-width="6" />
          <!-- Ocean Floor Coral -->
          <path d="M 80 540 C 90 480, 60 450, 90 420 C 120 450, 90 490, 120 540" stroke="#f43f5e" stroke-width="10" />
          <path d="M 110 540 C 130 470, 170 480, 150 540" stroke="#fb7185" stroke-width="8" />
          <!-- Ocean Sandy Bed -->
          <path d="M 30 540 L 770 540" stroke="#64748b" stroke-width="8" stroke-dasharray="2 2" />
        </g>
      </svg>
    `
  }
];
