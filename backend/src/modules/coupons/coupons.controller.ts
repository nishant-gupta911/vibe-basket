import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateCouponDto } from './dto/coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Get()
  @UseGuards(AdminGuard)
  list() {
    return this.couponsService.listCoupons();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.createCoupon(dto);
  }
}
