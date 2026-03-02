import { Request, Response, NextFunction } from 'express';

const sanitize = (value: any): any => {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') {
    const result: Record<string, any> = {};
    Object.keys(value).forEach((key) => {
      result[key] = sanitize(value[key]);
    });
    return result;
  }
  return value;
};

export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  next();
}
