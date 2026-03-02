import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(userId: string | null, sessionId: string | null, event: string, meta?: Record<string, any>) {
    const analyticsEvent = await this.prisma.analyticsEvent.create({
      data: {
        event,
        meta,
        userId: userId || undefined,
        sessionId: sessionId || undefined,
      },
    });

    return {
      success: true,
      data: analyticsEvent,
      message: 'Event tracked',
    };
  }
}
