import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { Outbox } from './entity/outbox.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpOutboxService {
    private readonly logger = new Logger(HttpOutboxService.name);
    private readonly REDIS_KEY = 'http_outbox_queue';

    constructor(
        @InjectRepository(Outbox)
        private readonly outboxRepository: Repository<Outbox>,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
    ) { }

    /**
     * Sends an HTTP POST request. On failure, saves to Redis, then Postgres fallback.
     * @param url - HTTP endpoint
     * @param data - Payload to send
     * @param entity - Domain entity name
     * @param transactionalEntityManager - Optional transactional context
     * @param config - Axios config
     */

    async sendHttpEvent(
        url: string,
        data: any,
        entity: string,
        transactionalEntityManager?: EntityManager,
        config?: AxiosRequestConfig,
    ): Promise<void> {
        try {
            await axios.post(url, data, config);
        } catch (err) {
            this.logger.warn(`HTTP request failed, saving to Redis: ${err.message}`);

            const payload = { url, data, entity, createdAt: new Date() };

            try {
                await this.redis.lpush(this.REDIS_KEY, JSON.stringify(payload));
            } catch (redisErr) {
                this.logger.warn(
                    `Redis unavailable, saving to Postgres outbox: ${redisErr.message}`,
                );

                const outboxItem = this.outboxRepository.create({
                    topic: url,
                    entity,
                    data,
                });

                if (transactionalEntityManager) {
                    await transactionalEntityManager.save(Outbox, outboxItem);
                } else {
                    await this.outboxRepository.save(outboxItem);
                }
            }
        }
    }


    async flushRedisOutbox(): Promise<void> {
        try {
            const items = await this.redis.lrange(this.REDIS_KEY, 0, -1);
            if (!items.length) return;

            for (const item of items.reverse()) {
                const { url, data,} = JSON.parse(item);
                try {
                    await axios.post(url, data);
                    await this.redis.lrem(this.REDIS_KEY, 1, item);
                } catch (err) {
                    this.logger.warn(`Failed to resend HTTP event from Redis: ${err.message}`);
                }
            }
        } catch (err) {
            this.logger.error(`Failed to flush Redis outbox: ${err.message}`);
        }
    }
}
