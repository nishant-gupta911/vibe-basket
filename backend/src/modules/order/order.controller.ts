import { Body, Controller, Get, Post, Query, Param, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateOrderDto, QueryOrderDto } from './dto/order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.userId, dto);
  }

  @Get()
  getOrders(@Request() req, @Query() query: QueryOrderDto) {
    return this.orderService.getOrders(req.user.userId, query.status);
  }

  @Get(':id')
  getOrder(@Request() req, @Param('id') id: string) {
    return this.orderService.getOrder(req.user.userId, id);
  }
}
