import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../redis-service/redis.service';

@Injectable()
export class RateLimitService {
    constructor(private readonly redisService: RedisService) { }

    async checkLimit(userId: string, key: string, limit = 3, ttl = 60) {
        const redisKey = `rate:${userId}:${key}`;
        const client = this.redisService.getClient();
        const currentStr = await client.get(redisKey);
        const current = currentStr ? Number(currentStr) : 0;

        if (current >= limit) {
            throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
        }

        console.log('Current count for', redisKey, 'is', current + 1);

        const pipeline = client.pipeline();
        pipeline.incr(redisKey);
        if (!current) {
            pipeline.expire(redisKey, ttl);
        }
        await pipeline.exec();

        return true;
    }
}