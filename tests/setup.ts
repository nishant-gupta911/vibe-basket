import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Clean up database before all tests
beforeAll(async () => {
  // Clear test data
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
});

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Export prisma for use in tests
export { prisma };
