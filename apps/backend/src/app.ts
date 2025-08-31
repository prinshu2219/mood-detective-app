import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { analyze } from './lib/analyze';
import { Session } from './models/Session';
import { Attempt } from './models/Attempt';
import { Score } from './models/Score';
import { Feedback } from './models/Feedback';

export function createApp() {
  const app = express();

  app.use(helmet());
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowed.length === 0) return callback(null, true);
        if (allowed.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan('dev'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);

  // Health (DB check happens in server.ts before listen in prod)
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'mood-detective-backend',
      time: new Date().toISOString(),
      db: 'unknown',
    });
  });

  // Helper to send uniform errors
  function sendError(
    res: express.Response,
    status: number,
    code: string,
    message: string
  ) {
    return res.status(status).json({ error: { code, message } });
  }

  // Sessions
  const createSessionBody = z.object({
    kidName: z.string().trim().max(50).optional(),
  });
  app.post('/api/sessions', async (req, res) => {
    const parsed = createSessionBody.safeParse(req.body ?? {});
    if (!parsed.success) {
      return sendError(res, 400, 'BAD_REQUEST', 'Invalid input');
    }
    try {
      const doc = await Session.create({ kidName: parsed.data.kidName });
      return res.status(201).json({ sessionId: doc._id.toString() });
    } catch (e) {
      return sendError(
        res,
        500,
        'SESSION_CREATE_FAILED',
        'Could not create session'
      );
    }
  });

  // Middleware: require valid session via x-session-id
  async function requireSession(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const sessionId = (req.headers['x-session-id'] as string) || '';
    if (!sessionId)
      return sendError(res, 401, 'NO_SESSION', 'x-session-id header required');
    try {
      const exists = await Session.exists({ _id: sessionId });
      if (!exists)
        return sendError(res, 401, 'INVALID_SESSION', 'Session not found');
      return next();
    } catch (e) {
      return sendError(
        res,
        500,
        'SESSION_CHECK_FAILED',
        'Session validation failed'
      );
    }
  }

  const analyzeBodySchema = z.object({ sentence: z.string().min(1).max(500) });
  const analyzeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    // Authless: rate limit based solely on IP
    keyGenerator: req => req.ip || 'unknown',
  });

  // Authless analyze endpoint with IP-based rate limiting
  app.post('/api/rules/analyze', analyzeLimiter, (req, res) => {
    const parsed = analyzeBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, 'BAD_REQUEST', 'Invalid input');
    }
    const { sentence } = parsed.data;
    try {
      const result = analyze(sentence);
      const { label, score, highlights } = result;
      return res.json({ label, score, highlights });
    } catch {
      return sendError(
        res,
        500,
        'ANALYZE_FAILED',
        'Failed to analyze sentence'
      );
    }
  });

  // Attempts
  const attemptBodySchema = z.object({
    sessionId: z.string().min(1),
    round: z.number().min(1).max(5),
    sentence: z.string().min(1).max(500),
    student: z.enum(['HAPPY', 'SAD', 'ANGRY']),
    ai: z.enum(['HAPPY', 'SAD', 'ANGRY', 'NEUTRAL']),
    correct: z.boolean(),
  });
  app.post('/api/attempts', requireSession, async (req, res) => {
    const parsed = attemptBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, 'BAD_REQUEST', 'Invalid input');
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
      return sendError(
        res,
        500,
        'ATTEMPT_SAVE_FAILED',
        'Failed to save attempt'
      );
    }
  });

  // Scores (leaderboard uses this)
  const scoreBodySchema = z.object({
    sessionId: z.string().min(1),
    total: z.number().min(1).max(5),
    correct: z.number().min(0).max(5),
    timeSpent: z.number().min(0),
  });
  app.post('/api/scores', requireSession, async (req, res) => {
    const parsed = scoreBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, 'BAD_REQUEST', 'Invalid input');
    }
    const { sessionId, total, correct, timeSpent } = parsed.data;
    const stars = Math.max(1, Math.min(5, Math.round((correct / total) * 5)));
    try {
      const doc = await Score.create({
        sessionId,
        total,
        correct,
        stars,
        difficulty: 'easy',
        timeSpent,
      });
      return res.status(201).json({ id: doc._id, stars: doc.stars });
    } catch (e) {
      return sendError(res, 500, 'SCORE_SAVE_FAILED', 'Failed to save score');
    }
  });

  // Optional leaderboard
  app.get('/api/leaderboard', async (_req, res) => {
    try {
      const top = await Score.find()
        .sort({ stars: -1, timeSpent: 1, completedAt: -1 })
        .limit(20)
        .lean();
      return res.json({
        items: top.map(t => ({
          sessionId: t.sessionId,
          stars: t.stars,
          correct: t.correct,
          total: t.total,
          timeSpent: t.timeSpent,
        })),
      });
    } catch (e) {
      return sendError(
        res,
        500,
        'LEADERBOARD_FAILED',
        'Failed to load leaderboard'
      );
    }
  });

  // Feedback
  const feedbackBody = z.object({
    sessionId: z.string().min(1),
    emojiRating: z.number().min(1).max(5),
    comment: z.string().max(1000).optional(),
    category: z.enum(['game', 'ui', 'content', 'general']).default('general'),
    helpful: z.boolean().default(true),
  });
  app.post('/api/feedback', requireSession, async (req, res) => {
    const parsed = feedbackBody.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, 'BAD_REQUEST', 'Invalid input');
    }
    try {
      const doc = await Feedback.create(parsed.data);
      return res.status(201).json({ id: doc._id });
    } catch (e) {
      return sendError(
        res,
        500,
        'FEEDBACK_SAVE_FAILED',
        'Failed to save feedback'
      );
    }
  });

  return app;
}

export const app = createApp();
