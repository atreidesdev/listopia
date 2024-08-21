import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';
import { RateLimitMiddleware } from './rate-limit.middleware';

@Module({
  providers: [PrismaService],
})
export class RateLimitModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('auth/login');
  }
}
