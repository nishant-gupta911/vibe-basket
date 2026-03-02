import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { logger } from '../utils/logger';

interface QueryMetric {
  count: number;
  totalMs: number;
  slowCount: number;
}

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  private requestCount = 0;
  private errorCount = 0;
  private slowRequestCount = 0;
  private totalRequestMs = 0;
  private queryMetrics = new Map<string, QueryMetric>();
  private flushInterval: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 60_000);
  }

  onModuleDestroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }

  recordRequest(durationMs: number, statusCode: number, slowThresholdMs: number) {
    this.requestCount += 1;
    this.totalRequestMs += durationMs;
    if (statusCode >= 500) {
      this.errorCount += 1;
    }
    if (durationMs >= slowThresholdMs) {
      this.slowRequestCount += 1;
    }
  }

  recordQuery(model: string, action: string, durationMs: number, slowThresholdMs: number) {
    const key = `${model}.${action}`;
    const metric = this.queryMetrics.get(key) || { count: 0, totalMs: 0, slowCount: 0 };
    metric.count += 1;
    metric.totalMs += durationMs;
    if (durationMs >= slowThresholdMs) {
      metric.slowCount += 1;
    }
    this.queryMetrics.set(key, metric);
  }

  flush() {
    if (this.requestCount > 0) {
      logger.log('info', 'metrics', {
        requestCount: this.requestCount,
        errorCount: this.errorCount,
        slowRequestCount: this.slowRequestCount,
        avgRequestMs: Math.round(this.totalRequestMs / this.requestCount),
      });
    }

    if (this.queryMetrics.size > 0) {
      const topQueries = Array.from(this.queryMetrics.entries())
        .map(([key, metric]) => ({
          query: key,
          count: metric.count,
          avgMs: Math.round(metric.totalMs / metric.count),
          slowCount: metric.slowCount,
        }))
        .sort((a, b) => b.avgMs - a.avgMs)
        .slice(0, 10);

      logger.log('info', 'db_metrics', { topQueries });
    }

    this.requestCount = 0;
    this.errorCount = 0;
    this.slowRequestCount = 0;
    this.totalRequestMs = 0;
    this.queryMetrics.clear();
  }
}
