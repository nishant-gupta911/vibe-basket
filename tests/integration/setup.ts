import { PrismaClient } from '@prisma/client';

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "OrderCommission",
      "VendorPayout",
      "TransactionLog",
      "PaymentWebhookEvent",
      "Payment",
      "Invoice",
      "CouponRedemption",
      "Coupon",
      "TaxRate",
      "Wishlist",
      "Review",
      "CartItem",
      "Cart",
      "Order",
      "Notification",
      "AnalyticsEvent",
      "Product",
      "Vendor",
      "User"
    RESTART IDENTITY CASCADE
  `);
  await prisma.$disconnect();
});
