import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase request size limit for base64 canvas images
app.use(express.json({ limit: "15mb" }));

// Initialize the Gemini SDK
// Note: We use lazy initialization/try-catch where needed to handle missing keys gracefully on startup
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (e) {
  console.error("Error initializing GoogleGenAI backend client:", e);
}

// REST API for Magic AI Companion feedback
app.post("/api/magic-feedback", async (req, res) => {
  try {
    const { image, companionType, challengeText } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API client is not configured. Ask the assistant or add your API key in Secrets panel."
      });
    }

    // Strip the data URL prefix if present e.g. "data:image/png;base64,"
    const matched = image.match(/^data:([^;]+);base64,(w*)/);
    let base64Data = image;
    let mimeType = "image/png";

    if (image.startsWith("data:")) {
      const parts = image.split(",");
      base64Data = parts[1] || "";
      const header = parts[0] || "";
      const mimeMatch = header.match(/data:(.*?);/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
    }

    // Determine the selected kid companion's persona
    let characterName = "Bella the Bunny";
    let personaPrompt = `You are Bella the Bunny, an extremely enthusiastic, loving, and bubbly bunny who loves to look at children's drawings. Use high-spirited kid-friendly words, lighthearted compliments, and playful bunny noises like "*twitch*", "*hop*", or "*gasp*". Keep your tone highly motivational and positive! Limit your response to 2 to 3 cheerful sentences, and add cute emojis! Refer to the user as 'young artist' or 'friend'.`;

    if (companionType === "owl") {
      characterName = "Ollie the Wise Owl";
      personaPrompt = `You are Ollie the Wise Owl, a very curious, smart, and friendly owl who loves to learn and explore. Use positive scholarly words but keep it very child-friendly. Say things like "Whoo-hoo!", "*flaps wings*", or "Magnificent!". Limit your response to 2 to 3 cheerful sentences, and add cute emojis! Keep it very encouraging!`;
    } else if (companionType === "dino") {
      characterName = "Dexter the Dino";
      personaPrompt = `You are Dexter the Small Dino, a roaringly happy, energetic baby dinosaur who loves art. Use friendly prehistoric noises like "*soft roar*", "*stomps happily*", or "Rrrr-iffic!". Limit your response to 2 to 3 creative sentences, and add fun emojis! Keep it highly positive, celebrating their creativity!`;
    }

    const drawingContext = challengeText 
      ? `The young artist tried to draw: "${challengeText}". Look at their canvas and tell them how awesome they did! Describe what you notice (shapes, colors, objects, or patterns) even if it's an abstract masterpiece.`
      : `Look at the young artist's drawing and describe what you notice (shapes, colors, energy, brush strokes) and make up a very short, magical, positive thought about it.`;

    const instructions = `${personaPrompt}\n\n${drawingContext}\n\nCRITICAL CONSTRAINTS:\n1. Speak directly to the child. Do not comment about the app UI or system.\n2. Keep it incredibly short (max 50-60 words) so it can be spoken easily/rapidly.\n3. Make them feel like a brilliant superstar painter!`;

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        imagePart,
        { text: instructions }
      ],
    });

    const text = response.text || "I love your artwork! It's full of beautiful colors and amazing imagination! Keep painting, superstar! 🌟";

    res.json({
      companion: characterName,
      feedback: text,
    });

  } catch (error: any) {
    console.error("Error in magic feedback:", error);
    res.status(500).json({ error: error.message || "Something went wrong while asking your Magic Companion." });
  }
});

// In-memory store for shared kid drawings (persists while server is running)
interface SharedDrawingRecord {
  id: string;
  imageBuffer: Buffer;
  templateName: string;
  createdAt: number;
}
const sharedDrawings = new Map<string, SharedDrawingRecord>();

// Helper to determine canonical public host URL (supporting Cloud Run proxies)
function getBaseUrl(req: express.Request): string {
  const forwardedHost = req.get("x-forwarded-host");
  const host = forwardedHost || req.get("host") || `localhost:${PORT}`;
  const proto = req.get("x-forwarded-proto") || (req.secure ? "https" : "http");
  return `${proto}://${host}`;
}

// 1. API Endpoint to upload a drawing for sharing
app.post("/api/share-drawing", (req, res) => {
  try {
    const { image, templateName } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "No image provided" });
    }

    // Extract base64 payload
    const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    const base64Data = matches ? matches[2] : image;
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Generate short friendly ID
    const id = `art-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const name = (templateName || "Masterpiece").trim();

    sharedDrawings.set(id, {
      id,
      imageBuffer,
      templateName: name,
      createdAt: Date.now(),
    });

    // Clean up items older than 7 days to preserve memory
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const [key, item] of sharedDrawings.entries()) {
      if (item.createdAt < sevenDaysAgo) {
        sharedDrawings.delete(key);
      }
    }

    const baseUrl = getBaseUrl(req);
    const imageUrl = `${baseUrl}/api/drawings/${id}.png`;
    const shareUrl = `${baseUrl}/share/${id}`;

    res.json({
      success: true,
      id,
      imageUrl,
      shareUrl,
    });
  } catch (error: any) {
    console.error("Error creating shared drawing:", error);
    res.status(500).json({ error: "Failed to create shareable drawing" });
  }
});

// 2. Serve the raw drawing image PNG (for OpenGraph previews, WhatsApp banners, and direct views)
app.get("/api/drawings/:id.png", (req, res) => {
  const { id } = req.params;
  const drawing = sharedDrawings.get(id);

  if (!drawing) {
    return res.status(404).send("Drawing not found or expired");
  }

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400, immutable");
  res.send(drawing.imageBuffer);
});

// 3. Social Media OpenGraph landing page with embedded preview card for WhatsApp, Facebook, X, etc.
app.get("/share/:id", (req, res) => {
  const { id } = req.params;
  const drawing = sharedDrawings.get(id);
  const baseUrl = getBaseUrl(req);

  const title = drawing ? `${drawing.templateName} - Magic Paint Castle` : "Magical Kids Drawing - Magic Paint Castle";
  const desc = drawing 
    ? `Look at this colorful "${drawing.templateName}" drawing created on Magic Paint Castle! Tap to view and paint your own artwork!` 
    : "Look at this colorful drawing created on Magic Paint Castle! Tap to view and paint your own artwork!";
  const imageUrl = drawing ? `${baseUrl}/api/drawings/${id}.png` : `${baseUrl}/pwa-512x512.png`;
  const sharePageUrl = `${baseUrl}/share/${id}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">

  <!-- OpenGraph Metadata for WhatsApp, Facebook, iMessage, Discord, Telegram -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${sharePageUrl}">
  <meta property="og:title" content="🎨 ${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="600">
  <meta property="og:site_name" content="Magic Paint Castle">

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${sharePageUrl}">
  <meta name="twitter:title" content="🎨 ${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${imageUrl}">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #fef3c7 100%);
      color: #1e1b4b;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
    }
    .card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(16px);
      border: 3px solid #ffffff;
      border-radius: 2rem;
      padding: 1.5rem;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.25);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 1rem;
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      color: #db2777;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 900;
      color: #1e1b4b;
      margin-bottom: 0.25rem;
    }
    p {
      color: #4338ca;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    .image-container {
      background: #ffffff;
      border-radius: 1.5rem;
      padding: 0.75rem;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.05);
      border: 2px dashed #f472b6;
      margin-bottom: 1.5rem;
    }
    .image-container img {
      width: 100%;
      height: auto;
      border-radius: 1rem;
      display: block;
      max-height: 420px;
      object-fit: contain;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #ec4899 0%, #6366f1 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 900;
      font-size: 1rem;
      padding: 0.875rem 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 10px 20px -5px rgba(236, 72, 153, 0.4);
      transition: transform 0.15s ease;
    }
    .btn-primary:active { transform: scale(0.97); }
    .btn-secondary {
      display: inline-block;
      color: #6366f1;
      font-weight: 700;
      font-size: 0.875rem;
      text-decoration: underline;
      padding: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✨ Magical Artwork Showcase ✨</div>
    <h1>${drawing ? drawing.templateName : "Young Artist Drawing"}</h1>
    <p>Painted with love on Magic Paint Castle 🏰🌈</p>

    <div class="image-container">
      <img src="${imageUrl}" alt="Artwork by a Young Artist" />
    </div>

    <div class="actions">
      <a href="${baseUrl}" class="btn-primary">
        🎨 Open Magic Paint Castle to Draw Along!
      </a>
      <a href="${imageUrl}" download="${drawing ? drawing.templateName : 'drawing'}.png" class="btn-secondary">
        💾 Download Picture
      </a>
    </div>
  </div>
</body>
</html>`;

  res.send(html);
});

// Serve static assets and connect Vite middleware
async function startServer() {
  // Always serve public directory static assets (manifest, sw.js, icons, etc.)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Direct endpoint for Google Play Store Privacy Policy requirement
  app.get(["/privacy", "/privacy-policy"], (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "privacy.html"));
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
