import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { Outbox } from './entity/outbox.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import axios, { AxiosRequestConfig } from 'axios';
import { MediaUploadService } from '../http-service/media-update.service';
import { HttpOutboxPayload } from './dto/payload.interfce';

@Injectable()
export class HttpOutboxService {
    private readonly logger = new Logger(HttpOutboxService.name);
    private readonly REDIS_KEY = 'http_outbox_queue';

    constructor(
        @InjectRepository(Outbox)
        private readonly outboxRepository: Repository<Outbox>,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        private readonly mediaUploadService: MediaUploadService,
    ) { }

    /**
     * Sends an HTTP POST request. On failure, saves to Redis, then Postgres fallback.
     * @param url - HTTP endpoint
     * @param data - Payload to send
     * @param entity - Domain entity name
     * @param transactionalEntityManager - Optional transactional context
     * @param config - Axios config
     */

    async saveHttpOutboxEvent(
        payload: HttpOutboxPayload,
        entity: string,
        transactionalEntityManager: EntityManager,
    ) {
        const outboxItem = this.outboxRepository.create({
            topic: payload.url,
            entity,
            data: payload,
        });

        await transactionalEntityManager.save(Outbox, outboxItem);
    }


    private async executeHttpPayload(payload: HttpOutboxPayload) {
        if (payload.method === 'PUT' && payload.file) {
            const mediaId = payload.url.split('/').pop();

            if (!mediaId) {
                throw new Error('Invalid mediaId in payload URL');
            }

            const orgId = payload.headers?.['x-organization'];

            if (!orgId) {
                throw new Error('Missing x-organization header in outbox payload');
            }


            await this.mediaUploadService.updateMediaFile(
                mediaId,
                Buffer.from(payload.file.bufferBase64, 'base64'),
                payload.file.filename,
                payload.file.mimeType,
                orgId,
                payload.body,
            );
            return;
        }

        await axios.request({
            method: payload.method,
            url: payload.url,
            data: payload.body,
            headers: payload.headers,
        });
    }


    async processOutbox(): Promise<void> {
        const items = await this.outboxRepository.find({
            where: {
                processedAt: null as any,
            },
            order: { createdAt: 'ASC' },
            take: 20,
        });

        for (const item of items) {
            try {
                await this.executeHttpPayload(item.data);

                item.processedAt = new Date();
                await this.outboxRepository.save(item);

            } catch (err) {
                this.logger.warn(
                    `Outbox item ${item.id} failed, will retry: ${err.message}`,
                );
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
