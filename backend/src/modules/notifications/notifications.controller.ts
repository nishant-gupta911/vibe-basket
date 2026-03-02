import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('unread') unread?: string,
    @Query('limit') limit?: string,
    @Query('since') since?: string,
  ) {
    const unreadOnly = unread === 'true';
    const parsedLimit = limit ? Number(limit) : undefined;
    const sinceDate = since ? new Date(since) : null;

    const notifications = await this.notificationsService.getNotifications(
      req.user?.userId || null,
      req.sessionId || null,
      {
        unreadOnly,
        limit: parsedLimit,
        since: sinceDate && !Number.isNaN(sinceDate.getTime()) ? sinceDate : null,
      },
    );

    return {
      success: true,
      data: notifications,
      message: 'Notifications retrieved',
    };
  }

  @Post('read')
  async markRead(@Request() req, @Body('ids') ids?: string[]) {
    const safeIds = Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
    const result = await this.notificationsService.markRead(
      req.user?.userId || null,
      req.sessionId || null,
      safeIds,
    );

    return {
      success: true,
      data: { count: result.count },
      message: 'Notifications updated',
    };
  }
}
