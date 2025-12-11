import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RedisService } from '../redis-service/redis.service';

@Injectable()
export class UsageTracingInterceptor implements NestInterceptor {
    constructor(private readonly redisService: RedisService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const user = req.user || { userId: 'anonymous' };
        const method = req.method;
        const url = req.url;
        const start = Date.now();

        return next.handle().pipe(
            tap(async () => {
                const duration = Date.now() - start;
                const logEntry = `${new Date().toISOString()} | ${method} ${url} | ${duration}`;
                const redisKey = `${user.userId}`;

                try {
                    const client = this.redisService.getClient();

                    if (!client) throw new Error('Redis client not available');

                    await this.redisService.lPush(redisKey, logEntry);
                    await this.redisService.lTrim(redisKey, 0, 99);
                    await this.redisService.expire(redisKey, 60 * 60 * 24);
                } catch (err: any) {
                    console.error('Failed to write usage log into Redis', err?.message || err);
                }

                console.log('Usage log entry:', redisKey);
                console.log(`${user.userId} | ${method} ${url} | ${duration}ms`);
            }),
        );
    }
}
