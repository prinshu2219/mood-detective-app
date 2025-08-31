import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';

vi.mock('../lib/analyze', () => ({
  analyze: (_sentence: string) => ({
    label: 'HAPPY',
    score: 2,
    highlights: [{ token: 'love', weight: 2 }],
  }),
}));

describe('POST /api/rules/analyze', () => {
  it('returns 200 with label/score/highlights for valid input', async () => {
    const res = await request(app)
      .post('/api/rules/analyze')
      .set('Content-Type', 'application/json')
      .send({ sentence: 'I really love this!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('label');
    expect(res.body).toHaveProperty('score');
    expect(res.body).toHaveProperty('highlights');
  });

  it('returns 400 for bad input', async () => {
    const res = await request(app)
      .post('/api/rules/analyze')
      .set('Content-Type', 'application/json')
      .send({ sentence: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
  it('rate limits after multiple requests from same IP', async () => {
    const agent = request(app);
    // send many requests quickly to trigger limiter (max 30/min by IP)
    const promises = Array.from({ length: 35 }).map(() =>
      agent
        .post('/api/rules/analyze')
        .set('Content-Type', 'application/json')
        .send({ sentence: 'ok' })
    );
    const results = await Promise.all(promises);
    const has429 = results.some((r: any) => r.status === 429);
    expect(has429).toBe(true);
  });
});
