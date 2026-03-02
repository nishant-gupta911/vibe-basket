import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApplyVendorDto, CreatePayoutDto } from './dto/vendor.dto';
import { VendorGuard } from '../../common/guards/vendor.guard';

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  apply(@Request() req, @Body() dto: ApplyVendorDto) {
    return this.vendorsService.applyVendor(req.user.userId, dto.verified);
  }

  @Post('payouts')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createPayout(@Body() dto: CreatePayoutDto) {
    return this.vendorsService.createPayout(dto.vendorId, dto.amount);
  }

  @Post('payouts/:id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  approve(@Param('id') id: string) {
    return this.vendorsService.approvePayout(id);
  }

  @Get('payouts')
  @UseGuards(JwtAuthGuard)
  payouts(@Request() req) {
    return this.vendorsService.listPayouts(req.user.userId);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, VendorGuard)
  dashboard(@Request() req) {
    return this.vendorsService.getDashboard(req.user.userId);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, VendorGuard)
  orders(@Request() req) {
    return this.vendorsService.getVendorOrders(req.user.userId);
  }

  @Get('performance')
  @UseGuards(JwtAuthGuard, VendorGuard)
  performance(@Request() req) {
    return this.vendorsService.getProductPerformance(req.user.userId);
  }
}
