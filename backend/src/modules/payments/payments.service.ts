import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import crypto from 'crypto';

const RAZORPAY_API = 'https://api.razorpay.com/v1/orders';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private getRazorpayAuth() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new BadRequestException('Payment provider not configured');
    }
    const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    return { keyId, token, keySecret };
  }

  async createPaymentIntent(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'PAID') {
      return {
        success: true,
        data: {
          orderId: order.id,
          status: order.status,
        },
        message: 'Order already paid',
      };
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        orderId: order.id,
        status: { in: ['CREATED', 'AUTHORIZED'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingPayment?.providerOrderId) {
      return {
        success: true,
        data: {
          orderId: order.id,
          amount: existingPayment.amount,
          currency: existingPayment.currency,
          providerOrderId: existingPayment.providerOrderId,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
        message: 'Payment intent reused',
      };
    }

    const { keyId, token } = this.getRazorpayAuth();
    const amount = Math.round(order.total * 100);
    const response = await fetch(RAZORPAY_API, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: order.id,
        payment_capture: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(`Payment provider error: ${errorText}`);
    }

    const razorpayOrder = await response.json();

    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        userId,
        provider: 'RAZORPAY',
        amount,
        currency: razorpayOrder.currency,
        status: razorpayOrder.status?.toUpperCase() || 'CREATED',
        providerOrderId: razorpayOrder.id,
      },
    });

    return {
      success: true,
      data: {
        orderId: order.id,
        amount,
        currency: razorpayOrder.currency,
        providerOrderId: razorpayOrder.id,
        keyId,
      },
      message: 'Payment intent created',
    };
  }

  async confirmPayment(
    userId: string,
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'PAID') {
      return {
        success: true,
        data: { orderId: order.id, status: order.status },
        message: 'Payment already confirmed',
      };
    }

    const { keySecret } = this.getRazorpayAuth();
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expected !== razorpaySignature) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED', paymentStatus: 'FAILED', failedAt: new Date() },
      });
      throw new BadRequestException('Invalid payment signature');
    }

    await this.prisma.$transaction([
      this.prisma.payment.updateMany({
        where: { orderId: order.id, providerOrderId: razorpayOrderId },
        data: {
          status: 'PAID',
          providerPaymentId: razorpayPaymentId,
          providerSignature: razorpaySignature,
        },
      }),
      this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentProvider: 'RAZORPAY',
          paymentReference: razorpayPaymentId,
          paidAt: new Date(),
        },
      }),
    ]);

    return {
      success: true,
      data: { orderId: order.id, status: 'PAID' },
      message: 'Payment confirmed',
    };
  }
}
