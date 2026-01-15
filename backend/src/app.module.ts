import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { AIModule } from './modules/ai/ai.module';
import { PrismaService } from './config/prisma.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    AIModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
