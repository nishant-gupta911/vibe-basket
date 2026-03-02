import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApplyVendorDto, CreatePayoutDto } from './dto/vendor.dto';
import { VendorGuard } from '../../common/guards/vendor.guard';
import { ProductService } from '../product/product.service';
import { UpdateProductDto } from '../product/dto/product.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService, private productService: ProductService) {}

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

  @Get('analytics')
  @UseGuards(JwtAuthGuard, VendorGuard)
  analytics(@Request() req) {
    return this.vendorsService.getVendorAnalytics(req.user.userId);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  approveVendor(@Param('id') id: string) {
    return this.vendorsService.approveVendor(id);
  }

  @Post(':id/suspend')
  @UseGuards(JwtAuthGuard, AdminGuard)
  suspendVendor(@Param('id') id: string) {
    return this.vendorsService.suspendVendor(id);
  }

  @Post(':id/deactivate-products')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deactivateProducts(@Param('id') id: string) {
    return this.vendorsService.deactivateVendorProducts(id);
  }

  @Get(':id/metrics')
  @UseGuards(JwtAuthGuard, AdminGuard)
  vendorMetrics(@Param('id') id: string) {
    return this.vendorsService.getVendorMetrics(id);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard, VendorGuard)
  updateProduct(@Request() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProductForVendor(req.user.userId, id, dto);
  }
}
