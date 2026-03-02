import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { InvoiceService } from '../invoice/invoice.service';
import crypto from 'crypto';

const RAZORPAY_API = 'https://api.razorpay.com/v1/orders';
const RAZORPAY_REFUND_API = 'https://api.razorpay.com/v1/payments';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private invoiceService: InvoiceService) {}

  private getRazorpayAuth() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new BadRequestException('Payment provider not configured');
    }
    const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    return { keyId, token, keySecret };
  }

  async createPaymentIntent(userId: string, orderId: string, idempotencyKey?: string) {
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
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
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
        idempotencyKey,
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
      await this.prisma.$transaction([
        this.prisma.order.update({
          where: { id: order.id },
          data: { status: 'FAILED', paymentStatus: 'FAILED', failedAt: new Date() },
        }),
        this.prisma.transactionLog.create({
          data: {
            orderId: order.id,
            provider: 'RAZORPAY',
            status: 'FAILED',
            reference: razorpayOrderId,
            message: 'Invalid payment signature',
          },
        }),
      ]);
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
      this.prisma.transactionLog.create({
        data: {
          orderId: order.id,
          provider: 'RAZORPAY',
          status: 'PAID',
          amount: Math.round(order.total * 100),
          reference: razorpayPaymentId,
          message: 'Payment confirmed',
        },
      }),
    ]);

    await this.invoiceService.generateInvoice(order.id);

    return {
      success: true,
      data: { orderId: order.id, status: 'PAID' },
      message: 'Payment confirmed',
    };
  }

  async handleWebhook(eventId: string, signature: string, body: string) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expected !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const parsed = JSON.parse(body);
    const event = parsed?.event;

    if (!eventId || !event) {
      throw new BadRequestException('Invalid webhook payload');
    }

    const alreadyHandled = await this.prisma.paymentWebhookEvent.findUnique({
      where: { eventId },
    });

    if (alreadyHandled) {
      return { success: true, data: { handled: false }, message: 'Duplicate webhook ignored' };
    }

    await this.prisma.paymentWebhookEvent.create({
      data: { eventId, provider: 'RAZORPAY' },
    });

    if (event === 'payment.captured' || event === 'payment.failed') {
      const paymentEntity = parsed?.payload?.payment?.entity;
      const providerOrderId = paymentEntity?.order_id;
      const providerPaymentId = paymentEntity?.id;
      const status = event === 'payment.captured' ? 'PAID' : 'FAILED';

      if (providerOrderId) {
        const payment = await this.prisma.payment.findFirst({
          where: { providerOrderId },
        });

        if (payment) {
          await this.prisma.$transaction([
            this.prisma.payment.updateMany({
              where: { providerOrderId },
              data: {
                status,
                providerPaymentId: providerPaymentId || payment.providerPaymentId,
              },
            }),
            this.prisma.order.update({
              where: { id: payment.orderId },
              data: {
                status,
                paymentStatus: status,
                paymentProvider: 'RAZORPAY',
                paymentReference: providerPaymentId || payment.providerPaymentId,
                ...(status === 'PAID' ? { paidAt: new Date() } : { failedAt: new Date() }),
              },
            }),
            this.prisma.transactionLog.create({
              data: {
                orderId: payment.orderId,
                paymentId: payment.id,
                provider: 'RAZORPAY',
                status,
                amount: payment.amount,
                reference: providerPaymentId || payment.providerPaymentId || providerOrderId,
                message: `Webhook ${event}`,
              },
            }),
          ]);

          if (status === 'PAID') {
            await this.invoiceService.generateInvoice(payment.orderId);
          }
        }
      }
    }

    return { success: true, data: { handled: true }, message: 'Webhook processed' };
  }

  async refundPayment(orderId: string, amount?: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.prisma.payment.findFirst({
      where: { orderId: order.id, status: 'PAID' },
      orderBy: { createdAt: 'desc' },
    });

    if (!payment?.providerPaymentId) {
      throw new BadRequestException('Payment not eligible for refund');
    }

    const refundAmount = amount ? Math.min(Math.round(amount * 100), payment.amount) : payment.amount;
    const { token } = this.getRazorpayAuth();
    const response = await fetch(`${RAZORPAY_REFUND_API}/${payment.providerPaymentId}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: refundAmount,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(`Refund failed: ${errorText}`);
    }

    const refund = await response.json();
    const newRefundedAmount = payment.refundedAmount + refundAmount;
    const isFullyRefunded = newRefundedAmount >= payment.amount;

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          refundedAmount: newRefundedAmount,
          refundStatus: isFullyRefunded ? 'REFUNDED' : 'PARTIAL',
          status: isFullyRefunded ? 'REFUNDED' : payment.status,
        },
      }),
      this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: isFullyRefunded ? 'REFUNDED' : order.status,
          paymentStatus: isFullyRefunded ? 'REFUNDED' : order.paymentStatus,
          refundedAt: isFullyRefunded ? new Date() : order.refundedAt,
        },
      }),
      this.prisma.transactionLog.create({
        data: {
          orderId: order.id,
          paymentId: payment.id,
          provider: 'RAZORPAY',
          status: isFullyRefunded ? 'REFUNDED' : 'PARTIAL_REFUND',
          amount: refundAmount,
          reference: refund.id,
          message: 'Refund processed',
        },
      }),
    ]);

    return {
      success: true,
      data: { orderId: order.id, refundedAmount: newRefundedAmount },
      message: 'Refund processed',
    };
  }
}
