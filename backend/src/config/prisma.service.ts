import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error?.message || error);
      console.error('⚠️ API started without an active database connection');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
