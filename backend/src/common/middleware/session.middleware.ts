import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

const parseCookies = (cookieHeader?: string) => {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (!key) return;
    const value = decodeURIComponent(parts.join('=')).trim();
    list[key] = value;
  });
  return list;
};

export function sessionTracker(req: Request, res: Response, next: NextFunction) {
  const cookies = parseCookies(req.headers.cookie);
  let sessionId = cookies.sessionId;

  if (!sessionId) {
    sessionId = randomUUID();
    res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
  }

  (req as any).sessionId = sessionId;
  next();
}
