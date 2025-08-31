import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './db/connection';
import { app as baseApp } from './app';
import { z } from 'zod';
import { Attempt } from './models/Attempt';
import { Score } from './models/Score';

const app = baseApp;

// Health check endpoint (DB-aware for prod run)
app.get('/api/health', async (_req: express.Request, res: express.Response) => {
  try {
    // Check database connection
    await connectToDatabase();
    res.json({ 
      ok: true, 
      service: 'mood-detective-backend', 
      time: new Date().toISOString(),
      db: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      service: 'mood-detective-backend', 
      time: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// Attempts endpoint
const attemptBodySchema = z.object({
  sessionId: z.string().min(1),
  round: z.number().min(1).max(5),
  sentence: z.string().min(1).max(500),
  student: z.enum(['HAPPY', 'SAD', 'ANGRY']),
  ai: z.enum(['HAPPY', 'SAD', 'ANGRY', 'NEUTRAL']),
  correct: z.boolean(),
});

app.post('/api/attempts', async (req: express.Request, res: express.Response) => {
  const parsed = attemptBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  try {
    const doc = await Attempt.create({
      sessionId: parsed.data.sessionId,
      sentence: parsed.data.sentence,
      engine: 'rules',
      predicted: parsed.data.ai,
      correct: parsed.data.correct,
    });
    return res.status(201).json({ id: doc._id });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save attempt' });
  }
});

// Score endpoint
const scoreBodySchema = z.object({
  sessionId: z.string().min(1),
  total: z.number().min(1).max(5),
  correct: z.number().min(0).max(5),
  timeSpent: z.number().min(0),
});

app.post('/api/scores', async (req: express.Request, res: express.Response) => {
  const parsed = scoreBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  const { sessionId, total, correct, timeSpent } = parsed.data;
  const stars = Math.max(1, Math.min(5, Math.round((correct / total) * 5)));
  try {
    const doc = await Score.create({ sessionId, total, correct, stars, difficulty: 'easy', timeSpent });
    return res.status(201).json({ id: doc._id, stars: doc.stars });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save score' });
  }
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database
    await connectToDatabase();
    console.log('[backend] Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`[backend] listening on :${PORT}`);
      console.log(`[backend] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[backend] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
