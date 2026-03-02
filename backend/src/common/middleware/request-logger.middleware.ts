import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { MetricsService } from '../metrics/metrics.service';

const SLOW_REQUEST_MS = 800;

export function createRequestLogger(metrics: MetricsService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - start;
      metrics.recordRequest(durationMs, res.statusCode, SLOW_REQUEST_MS);
      logger.log('info', 'request', {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
        ip: req.ip,
      });
      if (durationMs >= SLOW_REQUEST_MS) {
        logger.log('warn', 'slow_request', {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          durationMs,
        });
      }
    });
    next();
  };
}
