import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

  const vendorUser = await prisma.user.create({
    data: {
      name: 'Integration Vendor',
      email: 'vendor-integration@example.com',
      password: 'password',
      role: 'vendor',
    },
  });

  const vendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      status: 'APPROVED',
      commissionRate: 10,
      payoutBalance: 0,
      verified: true,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        title: 'Premium Laptop Pro',
        description: 'Premium laptop for professionals',
        category: 'electronics',
        price: 999.99,
        stock: 20,
        inStock: true,
        tags: ['premium', 'laptop'],
        image: 'https://example.com/laptop.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Casual Shirt',
        description: 'Comfortable shirt for daily wear',
        category: 'clothing',
        price: 39.99,
        stock: 50,
        inStock: true,
        tags: ['casual', 'premium'],
        image: 'https://example.com/shirt.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Running Sneakers',
        description: 'Sporty footwear for runners',
        category: 'footwear',
        price: 79.99,
        stock: 40,
        inStock: true,
        tags: ['sporty'],
        image: 'https://example.com/shoes.jpg',
        vendorId: vendor.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
