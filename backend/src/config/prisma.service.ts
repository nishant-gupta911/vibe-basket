import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MetricsService } from '../common/metrics/metrics.service';
import { logger } from '../common/utils/logger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Optional() private metrics?: MetricsService) {
    super();
  }

  async onModuleInit() {
    try {
      if (this.metrics) {
        this.$use(async (params, next) => {
          const start = Date.now();
          const result = await next(params);
          const durationMs = Date.now() - start;
          this.metrics?.recordQuery(params.model || 'unknown', params.action, durationMs, 200);
          if (durationMs >= 200) {
            logger.log('warn', 'slow_query', {
              model: params.model,
              action: params.action,
              durationMs,
            });
          }
          return result;
        });
      }
      await this.$connect();
      logger.log('info', 'db_connected', {});
    } catch (error: any) {
      logger.log('error', 'db_connection_failed', { message: error?.message || error });
      logger.log('warn', 'db_connection_missing', {});
      if (process.env.NODE_ENV === 'test') {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
