import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ReviewModule } from './modules/review/review.module';
import { HealthModule } from './modules/health/health.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PersonalizationModule } from './modules/personalization/personalization.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { AIModule } from './modules/ai/ai.module';
import { PrismaService } from './config/prisma.service';
import { JobsModule } from './modules/jobs/jobs.module';
import { CacheModule } from './common/cache/cache.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { TaxModule } from './modules/tax/tax.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    CacheModule,
    MetricsModule,
    AuthModule,
    UserModule,
    ProductModule,
    WishlistModule,
    ReviewModule,
    HealthModule,
    AnalyticsModule,
    PersonalizationModule,
    RecommendationModule,
    NotificationsModule,
    PaymentsModule,
    CouponsModule,
    TaxModule,
    InvoiceModule,
    ReportsModule,
    CartModule,
    OrderModule,
    AIModule,
    JobsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
