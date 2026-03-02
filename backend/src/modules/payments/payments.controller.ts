import { Body, Controller, Headers, Post, Req, Request, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfirmPaymentDto, CreatePaymentIntentDto, RefundPaymentDto } from './dto/payment.dto';
import { Request as ExpressRequest } from 'express';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent')
  createIntent(@Request() req, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(req.user.userId, dto.orderId, dto.idempotencyKey);
  }

  @Post('confirm')
  confirm(@Request() req, @Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(
      req.user.userId,
      dto.orderId,
      dto.razorpay_order_id,
      dto.razorpay_payment_id,
      dto.razorpay_signature,
    );
  }

  @Post('refund')
  @UseGuards(AdminGuard)
  refund(@Body() dto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(dto.orderId, dto.amount);
  }

  @Post('webhook')
  webhook(@Headers('x-razorpay-signature') signature: string, @Req() req: ExpressRequest) {
    const rawBody = (req as any).rawBody?.toString('utf8') || '';
    return this.paymentsService.handleWebhook(req.headers['x-razorpay-event-id'] as string, signature, rawBody);
  }
}
