import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for server-side Gemini nutrition lookup
app.post('/api/nutrition-lookup', async (req, res) => {
  const { foodName } = req.body;
  if (!foodName || typeof foodName !== 'string') {
    return res.status(400).json({ error: 'foodName is required' });
  }

  const cleanName = foodName.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Return estimated nutrition for 1 typical standard serving of "${cleanName}".
Respond strictly in JSON format with schema:
{
  "name": "standard short display name",
  "serving": "description of standard serving (e.g., 1 bowl, 1 piece, 100g)",
  "grams": estimated weight in grams as number,
  "calories": estimated kcal as integer,
  "protein": estimated protein in grams as number,
  "carbs": estimated carbs in grams as number,
  "fat": estimated fat in grams as number,
  "category": "staples" | "curries" | "protein" | "breakfast" | "snacks" | "fruits" | "beverages"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        const food = {
          name: parsed.name || cleanName,
          synonyms: [cleanName.toLowerCase()],
          serving: parsed.serving || '1 portion (100g)',
          grams: Number(parsed.grams) || 100,
          calories: Math.round(Number(parsed.calories) || 150),
          protein: Math.round((Number(parsed.protein) || 6) * 10) / 10,
          carbs: Math.round((Number(parsed.carbs) || 18) * 10) / 10,
          fat: Math.round((Number(parsed.fat) || 5) * 10) / 10,
          category: parsed.category || 'custom',
        };
        return res.json({ food });
      }
    } catch (err: any) {
      console.warn('Server Gemini lookup warning, generating fallback estimate:', err?.message || err);
    }
  }

  // Graceful fallback estimation when API key not set or model error occurs
  const fallbackFood = {
    name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    synonyms: [cleanName.toLowerCase()],
    serving: '1 serving (100g)',
    grams: 100,
    calories: 160,
    protein: 6.0,
    carbs: 20.0,
    fat: 5.0,
    category: 'custom',
  };

  return res.json({ food: fallbackFood });
});

// Vite middleware for dev or static files for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NutriPulse - Minimalist Calorie & Food Tracker</title>
  </head>
  <body class="bg-black text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        const fs = await import('fs');
        const indexPath = path.resolve(process.cwd(), 'index.html');
        if (fs.existsSync(indexPath)) {
          template = await fs.promises.readFile(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
        }
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
