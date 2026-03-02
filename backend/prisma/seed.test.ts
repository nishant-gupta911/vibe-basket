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
      // Additional products to cover mood-profile preferred categories
      {
        title: 'Elegant Watch',
        description: 'A premium elegant watch perfect for special occasions and gifting',
        category: 'accessories',
        price: 299.99,
        stock: 15,
        inStock: true,
        tags: ['premium', 'elegant', 'gift'],
        image: 'https://example.com/watch.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Smart Home Speaker',
        description: 'Wireless smart speaker for your home, innovative and advanced technology',
        category: 'home',
        price: 149.99,
        stock: 30,
        inStock: true,
        tags: ['tech', 'smart', 'wireless'],
        image: 'https://example.com/speaker.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Yoga Mat Pro',
        description: 'Professional yoga mat for fitness, gym and athletic training',
        category: 'sports',
        price: 49.99,
        stock: 60,
        inStock: true,
        tags: ['sporty', 'fitness', 'gym'],
        image: 'https://example.com/yogamat.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Wireless Earbuds',
        description: 'Advanced wireless earbuds with smart features',
        category: 'electronics',
        price: 129.99,
        stock: 25,
        inStock: true,
        tags: ['tech', 'wireless', 'portable'],
        image: 'https://example.com/earbuds.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Leather Wallet',
        description: 'Quality leather wallet, elegant and durable for everyday and formal use',
        category: 'accessories',
        price: 59.99,
        stock: 35,
        inStock: true,
        tags: ['premium', 'leather', 'elegant'],
        image: 'https://example.com/wallet.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Scented Candle Set',
        description: 'Romantic premium candle set for special evenings and celebrations',
        category: 'home',
        price: 34.99,
        stock: 45,
        inStock: true,
        tags: ['premium', 'special', 'romantic'],
        image: 'https://example.com/candles.jpg',
        vendorId: vendor.id,
      },
      {
        title: 'Fitness Tracker Band',
        description: 'Athletic fitness tracker for gym, running and sports activities',
        category: 'sports',
        price: 89.99,
        stock: 20,
        inStock: true,
        tags: ['sporty', 'fitness', 'tech'],
        image: 'https://example.com/tracker.jpg',
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
