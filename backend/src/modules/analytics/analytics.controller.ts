import { Body, Controller, Post, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

interface TrackEventDto {
  event: string;
  meta?: Record<string, any>;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post()
  trackEvent(@Request() req, @Body() dto: TrackEventDto) {
    return this.analyticsService.trackEvent(req.user?.userId || null, dto.event, dto.meta);
  }
}
