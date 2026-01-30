/**
 * INTEGRATION TESTS: Products API
 * Tests product listing, search, and filtering
 */

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../backend/src/app.module';
import { PrismaService } from '../../backend/src/config/prisma.service';

describe('Products API Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    
    await app.init();

    // Ensure we have test products
    const count = await prisma.product.count();
    if (count === 0) {
      throw new Error('No products in database. Run: npm run seed');
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/products', () => {
    test('should return list of products', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const product = response.body[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('tags');
    });

    test('should filter by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?category=electronics')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((p: any) => p.category === 'electronics')).toBe(true);
    });

    test('should filter by multiple categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?category=clothing,footwear')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((p: any) => 
        ['clothing', 'footwear'].includes(p.category)
      )).toBe(true);
    });

    test('should filter by price range', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?minPrice=50&maxPrice=100')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((p: any) => 
        p.price >= 50 && p.price <= 100
      )).toBe(true);
    });

    test('should filter by tags', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?tags=premium')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((p: any) => 
        p.tags.includes('premium')
      )).toBe(true);
    });

    test('should limit results', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?limit=10')
        .expect(200);

      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    test('should paginate results', async () => {
      const page1 = await request(app.getHttpServer())
        .get('/api/products?limit=5&skip=0')
        .expect(200);

      const page2 = await request(app.getHttpServer())
        .get('/api/products?limit=5&skip=5')
        .expect(200);

      expect(page1.body.length).toBe(5);
      expect(page2.body.length).toBe(5);
      expect(page1.body[0].id).not.toBe(page2.body[0].id);
    });
  });

  describe('GET /api/products/:id', () => {
    let testProductId: string;

    beforeAll(async () => {
      const products = await prisma.product.findMany({ take: 1 });
      testProductId = products[0].id;
    });

    test('should return single product by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/products/${testProductId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testProductId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('price');
    });

    test('should return 404 for non-existent product', async () => {
      await request(app.getHttpServer())
        .get('/api/products/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /api/products/categories', () => {
    test('should return list of categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Should include common categories
      const categories = response.body.map((c: any) => c.category || c);
      expect(categories).toContain('clothing');
      expect(categories).toContain('electronics');
    });
  });

  describe('Product Search', () => {
    test('should search products by title', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?search=laptop')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((p: any) => 
        p.title.toLowerCase().includes('laptop')
      )).toBe(true);
    });

    test('should search products by description', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?search=premium')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body.some((p: any) => 
          p.description?.toLowerCase().includes('premium') || 
          p.tags.includes('premium')
        )).toBe(true);
      }
    });

    test('should return empty array for no matches', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?search=zzznonexistentkeywordzzz')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('Product Combinations', () => {
    test('should combine category and price filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?category=clothing&minPrice=20&maxPrice=100')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((p: any) => 
        p.category === 'clothing' && p.price >= 20 && p.price <= 100
      )).toBe(true);
    });

    test('should combine search with filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?search=shirt&category=clothing&maxPrice=50')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body.every((p: any) => 
          p.category === 'clothing' && p.price <= 50
        )).toBe(true);
      }
    });
  });

  describe('Product Stock', () => {
    test('should only return in-stock products by default', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      expect(response.body.every((p: any) => p.inStock === true)).toBe(true);
    });

    test('should include stock information', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      expect(response.body[0]).toHaveProperty('stock');
      expect(typeof response.body[0].stock).toBe('number');
    });
  });
});
