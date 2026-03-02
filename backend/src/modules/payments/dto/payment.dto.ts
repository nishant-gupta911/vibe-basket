import { IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  orderId: string;
}

export class ConfirmPaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  razorpay_order_id: string;

  @IsString()
  razorpay_payment_id: string;

  @IsString()
  razorpay_signature: string;
}
