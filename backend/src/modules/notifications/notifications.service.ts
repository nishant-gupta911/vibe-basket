import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

interface NotificationQuery {
  unreadOnly?: boolean;
  limit?: number;
  since?: Date | null;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string | null,
    sessionId: string | null,
    type: string,
    message: string,
    meta?: Record<string, any>,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: userId || undefined,
        sessionId: sessionId || undefined,
        type,
        message,
        meta,
      },
    });

    return notification;
  }

  async getNotifications(userId: string | null, sessionId: string | null, query: NotificationQuery) {
    const limit = Number.isFinite(query.limit) ? Math.min(Math.max(query.limit || 10, 1), 50) : 10;
    const where: any = {
      OR: [
        ...(userId ? [{ userId }] : []),
        ...(sessionId ? [{ sessionId }] : []),
      ],
    };

    if (query.unreadOnly) {
      where.read = false;
    }

    if (query.since) {
      where.createdAt = { gte: query.since };
    }

    if (!where.OR.length) {
      return [];
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markRead(userId: string | null, sessionId: string | null, ids: string[]) {
    if (ids.length === 0) {
      return { count: 0 };
    }

    const where: any = {
      id: { in: ids },
      OR: [
        ...(userId ? [{ userId }] : []),
        ...(sessionId ? [{ sessionId }] : []),
      ],
    };

    if (!where.OR.length) {
      return { count: 0 };
    }

    return this.prisma.notification.updateMany({
      where,
      data: { read: true },
    });
  }
}
