import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { AppModule } from './app.module';
import { config, validateEnv } from './config/env';
import { createRequestLogger } from './common/middleware/request-logger.middleware';
import { securityHeaders } from './common/middleware/security-headers.middleware';
import { rateLimit } from './common/middleware/rate-limit.middleware';
import { sanitizeInput } from './common/middleware/sanitize.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sessionTracker } from './common/middleware/session.middleware';
import { MetricsService } from './common/metrics/metrics.service';

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: true }));

  app.use(securityHeaders);
  app.use(rateLimit);
  app.use(sanitizeInput);
  app.use(sessionTracker);
  app.use(createRequestLogger(app.get(MetricsService)));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // API prefix
  app.setGlobalPrefix('api');
  
  await app.listen(config.port);
  console.log(`🚀 Backend running on http://localhost:${config.port}/api`);
}

bootstrap();
