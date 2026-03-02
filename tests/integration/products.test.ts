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
    app.setGlobalPrefix('api');
    
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

  const productsFrom = (response: any) => response.body.data.products;

  describe('GET /api/products', () => {
    test('should return list of products', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);

      const product = products[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('tags');
    });

    test('should filter by category', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?category=electronics')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      expect(products.every((p: any) => p.category === 'electronics')).toBe(true);
    });

    test('should filter by multiple categories', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?category=clothing,footwear')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      expect(products.every((p: any) => 
        ['clothing', 'footwear'].includes(p.category)
      )).toBe(true);
    });

    test('should filter by price range', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?minPrice=50&maxPrice=100')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      expect(products.every((p: any) => 
        p.price >= 50 && p.price <= 100
      )).toBe(true);
    });

    test('should filter by tags', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?tags=premium')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      expect(products.every((p: any) => 
        p.tags.includes('premium')
      )).toBe(true);
    });

    test('should limit results', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?limit=10')
        .expect(200);

      expect(productsFrom(response).length).toBeLessThanOrEqual(10);
    });

    test('should paginate results', async () => {
      const page1 = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?limit=2&page=1')
        .expect(200);

      const page2 = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?limit=2&page=2')
        .expect(200);

      const p1 = productsFrom(page1);
      const p2 = productsFrom(page2);
      expect(p1.length).toBe(2);
      expect(p2.length).toBeGreaterThanOrEqual(1);
      expect(p1[0].id).not.toBe(p2[0].id);
    });
  });

  describe('GET /api/products/:id', () => {
    let testProductId: string;

    beforeAll(async () => {
      const products = await prisma.product.findMany({ take: 1 });
      testProductId = products[0].id;
    });

    test('should return single product by ID', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get(`/api/products/${testProductId}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id', testProductId);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('description');
      expect(response.body.data).toHaveProperty('price');
    });

    test('should return 404 for non-existent product', async () => {
      await request(app.getHttpAdapter().getInstance())
        .get('/api/products/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /api/products/categories', () => {
    test('should return list of categories', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products/categories')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Should include common categories
      const categories = response.body.data.map((c: any) => c.name || c.category || c);
      expect(categories).toContain('clothing');
      expect(categories).toContain('electronics');
    });
  });

  describe('Product Search', () => {
    test('should search products by title', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?search=laptop')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      expect(products.some((p: any) => 
        p.title.toLowerCase().includes('laptop')
      )).toBe(true);
    });

    test('should search products by description', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?search=premium')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      if (products.length > 0) {
        expect(products.some((p: any) => 
          p.description?.toLowerCase().includes('premium') || 
          p.tags.includes('premium')
        )).toBe(true);
      }
    });

    test('should return empty array for no matches', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?search=zzznonexistentkeywordzzz')
        .expect(200);

      expect(productsFrom(response)).toEqual([]);
    });
  });

  describe('Product Combinations', () => {
    test('should combine category and price filters', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?category=clothing&minPrice=20&maxPrice=100')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      expect(products.every((p: any) => 
        p.category === 'clothing' && p.price >= 20 && p.price <= 100
      )).toBe(true);
    });

    test('should combine search with filters', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products?search=shirt&category=clothing&maxPrice=50')
        .expect(200);

      const products = productsFrom(response);
      expect(Array.isArray(products)).toBe(true);
      if (products.length > 0) {
        expect(products.every((p: any) => 
          p.category === 'clothing' && p.price <= 50
        )).toBe(true);
      }
    });
  });

  describe('Product Stock', () => {
    test('should only return in-stock products by default', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products')
        .expect(200);

      expect(productsFrom(response).every((p: any) => p.inStock === true)).toBe(true);
    });

    test('should include stock information', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .get('/api/products')
        .expect(200);

      expect(productsFrom(response)[0]).toHaveProperty('stock');
      expect(typeof productsFrom(response)[0].stock).toBe('number');
    });
  });
});
