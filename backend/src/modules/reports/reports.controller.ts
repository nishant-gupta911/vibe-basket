import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('reports')
@UseGuards(AdminGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('revenue')
  revenue() {
    return this.reportsService.getRevenueSummary();
  }

  @Get('marketplace')
  marketplace() {
    return this.reportsService.getMarketplaceRevenue();
  }
}
