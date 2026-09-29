import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Check script model connectivity
  app.get('/api/check', async (_req, res) => {
    try {
      const { testScriptModel } = await import('./server/geminiService.ts');
      const result = await testScriptModel();
      res.json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ ok: false, error: message });
    }
  });

  // Script generation endpoint
  app.post('/api/script', async (req, res) => {
    try {
      const { prompt, format, level, minutes, length, mood } = req.body;
      const parsedMinutes =
        typeof minutes === 'number'
          ? minutes
          : typeof length === 'number'
          ? length
          : parseInt(String(minutes || length || '3').replace(/\D/g, ''), 10) || 3;

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        res.status(400).json({ error: 'A prompt inquiry is required.' });
        return;
      }

      const { generateScript } = await import('./server/geminiService.ts');
      const result = await generateScript({
        prompt: prompt.trim(),
        format: format || 'Interpretation debate',
        level: level || 'Curious',
        minutes: parsedMinutes,
        mood: mood || 'Curious',
      });

      res.json(result);
    } catch (err: unknown) {
      const is429 =
        (err as { statusCode?: number })?.statusCode === 429 ||
        String(err).includes('429') ||
        String(err).includes('Free limit reached');

      if (is429) {
        res.status(429).json({
          error: 'Free limit reached. Wait a minute and try again.',
        });
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to generate script';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
