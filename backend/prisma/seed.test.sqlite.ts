/**
 * SQLite-compatible test seed for integration test fallback.
 *
 * Mirrors seed.test.ts but avoids PostgreSQL-specific operations
 * (TRUNCATE ... CASCADE) and stores tags as JSON-encoded strings
 * since the SQLite schema uses String instead of String[].
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // SQLite-compatible: delete in reverse dependency order
  const models = [
    'OrderCommission',
    'VendorPayout',
    'TransactionLog',
    'PaymentWebhookEvent',
    'Payment',
    'Invoice',
    'CouponRedemption',
    'Coupon',
    'TaxRate',
    'Wishlist',
    'Review',
    'CartItem',
    'Cart',
    'Order',
    'Notification',
    'AnalyticsEvent',
    'Product',
    'Vendor',
    'User',
  ];
  for (const model of models) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${model}"`);
  }

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

  // In SQLite mode, tags is a plain String field (JSON-encoded)
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Product" (id, title, description, category, price, stock, "inStock", tags, image, "vendorId", rating, "reviewCount", popularity, "createdAt", "updatedAt")
     VALUES
       (lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(6))),
        'Premium Laptop Pro', 'Premium laptop for professionals', 'electronics', 999.99, 20, 1, '["premium","laptop"]', 'https://example.com/laptop.jpg', '${vendor.id}', 0, 0, 0, datetime('now'), datetime('now')),
       (lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(6))),
        'Casual Shirt', 'Comfortable shirt for daily wear', 'clothing', 39.99, 50, 1, '["casual","premium"]', 'https://example.com/shirt.jpg', '${vendor.id}', 0, 0, 0, datetime('now'), datetime('now')),
       (lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(2)))||'-'||lower(hex(randomblob(6))),
        'Running Sneakers', 'Sporty footwear for runners', 'footwear', 79.99, 40, 1, '["sporty"]', 'https://example.com/shoes.jpg', '${vendor.id}', 0, 0, 0, datetime('now'), datetime('now'))`
  );

  console.log('[seed:sqlite] Seeded 1 vendor + 3 products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
