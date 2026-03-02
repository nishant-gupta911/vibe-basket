import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  orderId: string;

  @IsString()
  @IsOptional()
  idempotencyKey?: string;
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

export class RefundPaymentDto {
  @IsString()
  orderId: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
