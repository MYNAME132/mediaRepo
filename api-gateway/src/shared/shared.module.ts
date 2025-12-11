import { Module } from '@nestjs/common';
import { UsageTracingInterceptor } from './tracing.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { RateLimitService } from './ratelimit.service';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisModule } from '../redis-service/redis.module';

@Module({
    imports: [RedisModule,],
    providers: [UsageTracingInterceptor, RateLimitService],
    exports: [UsageTracingInterceptor, RateLimitService],
})
export class SharedModule {}