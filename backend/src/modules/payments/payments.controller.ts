import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfirmPaymentDto, CreatePaymentIntentDto } from './dto/payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent')
  createIntent(@Request() req, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(req.user.userId, dto.orderId);
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
}
