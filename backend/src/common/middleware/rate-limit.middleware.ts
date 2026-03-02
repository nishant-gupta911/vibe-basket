import { Request, Response, NextFunction } from 'express';

const windowMs = 15 * 60 * 1000;
const maxRequests = 300;
const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (entry.count >= maxRequests) {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
    return;
  }

  entry.count += 1;
  store.set(key, entry);
  next();
}
