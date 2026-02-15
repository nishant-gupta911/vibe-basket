/**
 * INTEGRATION TESTS: Auth API Endpoints
 * Tests the complete authentication flow
 */

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../backend/src/app.module';
import { PrismaService } from '../../backend/src/config/prisma.service';

describe('Auth API Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    app.setGlobalPrefix('api');
    
    await app.init();

    // Clean up test data
    await prisma.user.deleteMany({
      where: { email: { contains: 'test@' } },
    });
  });

  afterAll(async () => {
    // Cleanup
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.name).toBe('Test User');
      expect(response.body.data.user).not.toHaveProperty('password');

      authToken = response.body.data.accessToken;
      userId = response.body.data.user.id;
    });

    test('should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com', // Same email
          password: 'Password123!',
        })
        .expect(409);
    });

    test('should reject invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!',
        })
        .expect(400);
    });

    test('should reject weak password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test2@example.com',
          password: '123', // Too weak
        })
        .expect(400);
    });

    test('should reject missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          // Missing email and password
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with correct credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('test@example.com');

      authToken = response.body.data.accessToken;
    });

    test('should reject incorrect password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });

    test('should reject non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);
    });

    test('should reject missing credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/auth/profile', () => {
    test('should get user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).not.toHaveProperty('password');
    });

    test('should reject request without token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });

    test('should reject invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Auth Flow - Complete Journey', () => {
    test('should complete full auth flow: register → login → profile', async () => {
      // 1. Register
      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Flow Test User',
          email: 'flowtest@example.com',
          password: 'FlowTest123!',
        })
        .expect(201);

      const token = registerResponse.body.data.accessToken;
      const user = registerResponse.body.data.user;
      expect(token).toBeDefined();

      // 2. Access profile with register token
      await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // 3. Login again
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'flowtest@example.com',
          password: 'FlowTest123!',
        })
        .expect(200);

      expect(loginResponse.body.data.accessToken).toBeDefined();

      // 4. Access profile with login token
      const profileResponse = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .expect(200);

      expect(profileResponse.body.data.email).toBe('flowtest@example.com');

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });
  });
});
