/**
 * INTEGRATION TESTS: AI API Endpoints
 * Tests chatbot and mood finder (rule-based, no external APIs)
 */

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../backend/src/app.module';

describe('AI API Integration Tests', () => {
  let app: INestApplication;
  const chatData = (response: any) => response.body.data;
  const moodSuggestions = (response: any) => response.body.data.suggestions;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/ai/chat', () => {
    test('should respond to greeting', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({
          message: 'Hello',
          conversationHistory: [],
        })
        .expect(200);

      expect(chatData(response)).toHaveProperty('reply');
      // The chatbot may greet with "hello", "hi", or another shopping-oriented
      // greeting — accept any reasonable greeting response.
      expect(chatData(response).reply.toLowerCase()).toMatch(/hello|hi|help|welcome|shop/);
    });

    test('should handle product search queries', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({
          message: 'Show me laptops under $1000',
          conversationHistory: [],
        })
        .expect(200);

      expect(chatData(response)).toHaveProperty('reply');
      expect(chatData(response)).toHaveProperty('productIds');
      expect(Array.isArray(chatData(response).productIds)).toBe(true);
    });

    test('should handle budget queries', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({
          message: 'I need something under $50',
          conversationHistory: [],
        })
        .expect(200);

      expect(chatData(response)).toHaveProperty('reply');
      expect(chatData(response)).toHaveProperty('productIds');
    });

    test('should handle category queries', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({
          message: 'Show me clothing',
          conversationHistory: [],
        })
        .expect(200);

      expect(chatData(response)).toHaveProperty('reply');
      expect(chatData(response)).toHaveProperty('productIds');
    });

    test('should handle style advice queries', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({
          message: 'What should I wear to office?',
          conversationHistory: [],
        })
        .expect(200);

      expect(chatData(response)).toHaveProperty('reply');
      expect(chatData(response).reply.length).toBeGreaterThan(0);
    });

    test('should reject off-topic queries politely', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({
          message: 'What is the weather today?',
          conversationHistory: [],
        })
        .expect(200);

      expect(chatData(response)).toHaveProperty('reply');
      expect(chatData(response).reply.toLowerCase()).toMatch(/help|shop|product/);
    });

    test('should reject empty message', async () => {
      await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({
          message: '',
        })
        .expect(400);
    });

    test('should handle missing message field', async () => {
      await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/chat')
        .send({})
        .expect(400);
    });
  });

  describe('POST /api/ai/mood', () => {
    test('should return recommendations for romantic anniversary', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Romantic',
          occasion: 'Anniversary',
          budget: 500,
        })
        .expect(200);

      expect(response.body.data).toHaveProperty('suggestions');
      expect(Array.isArray(moodSuggestions(response))).toBe(true);
      expect(moodSuggestions(response).length).toBeGreaterThan(0);
      
      const rec = moodSuggestions(response)[0];
      expect(rec).toHaveProperty('product');
      expect(rec).toHaveProperty('reason');
      expect(rec.product.price).toBeLessThanOrEqual(500);
    });

    test('should return recommendations for sporty gym', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Sporty',
          occasion: 'Gym',
          budget: 200,
        })
        .expect(200);

      expect(response.body.data).toHaveProperty('suggestions');
      expect(moodSuggestions(response).length).toBeGreaterThan(0);
    });

    test('should respect budget constraint', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Casual',
          occasion: 'DailyUse',
          budget: 50,
        })
        .expect(200);

      const recommendations = moodSuggestions(response);
      expect(recommendations.every((r: any) => r.product.price <= 50)).toBe(true);
    });

    test('should handle high budget', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Professional',
          occasion: 'Office',
          budget: 2000,
        })
        .expect(200);

      expect(moodSuggestions(response).length).toBeGreaterThan(0);
    });

    test('should reject missing mood', async () => {
      await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          occasion: 'Party',
          budget: 300,
        })
        .expect(400);
    });

    test('should reject missing occasion', async () => {
      await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Happy',
          budget: 300,
        })
        .expect(400);
    });

    test('should reject invalid budget', async () => {
      await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Happy',
          occasion: 'Party',
          budget: -100,
        })
        .expect(400);
    });

    test('should reject zero budget', async () => {
      await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Casual',
          occasion: 'DailyUse',
          budget: 0,
        })
        .expect(400);
    });
  });

  describe('AI - Mood Finder Tags', () => {
    test('should avoid casual items for elegant occasions', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Elegant',
          occasion: 'FormalEvent',
          budget: 1000,
        })
        .expect(200);

      const suggestions = moodSuggestions(response);
      
      const casualReasonCount = suggestions.filter((r: any) =>
        String(r.reason || '').toLowerCase().includes('casual')
      ).length;
      expect(casualReasonCount).toBe(0);
    });

    test('should provide personalized explanations', async () => {
      const response = await request(app.getHttpAdapter().getInstance())
        .post('/api/ai/mood')
        .send({
          mood: 'Romantic',
          occasion: 'DateNight',
          budget: 300,
        })
        .expect(200);

      expect(moodSuggestions(response).every((r: any) => 
        r.reason && r.reason.length > 0
      )).toBe(true);
    });
  });
});
