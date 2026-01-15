import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed products
  const products = [
    {
      title: 'Premium Wireless Headphones',
      description: 'High-quality noise-canceling wireless headphones',
      category: 'electronics',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      inStock: true,
    },
    {
      title: 'Smart Watch Pro',
      description: 'Advanced fitness tracking and notifications',
      category: 'electronics',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      inStock: true,
    },
    {
      title: 'Leather Wallet',
      description: 'Genuine leather bifold wallet',
      category: 'accessories',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
      inStock: true,
    },
    {
      title: 'Running Shoes',
      description: 'Comfortable athletic running shoes',
      category: 'clothing',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      inStock: true,
    },
    {
      title: 'Laptop Backpack',
      description: 'Durable backpack with laptop compartment',
      category: 'accessories',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
      inStock: true,
    },
    {
      title: 'Coffee Maker',
      description: 'Programmable drip coffee maker',
      category: 'home',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
      inStock: true,
    },
    {
      title: 'Yoga Mat',
      description: 'Non-slip exercise yoga mat',
      category: 'sports',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
      inStock: true,
    },
    {
      title: 'Sunglasses',
      description: 'Polarized UV protection sunglasses',
      category: 'accessories',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
      inStock: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
