import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpOutboxService } from './outbox.service';

@Injectable()
export class OutboxCronService {
    constructor(private readonly httpOutboxService: HttpOutboxService) { }
    @Cron(CronExpression.EVERY_5_MINUTES)
    handleCron() {
        console.log('[OutboxCron] Triggering Redis flush...');
        this.httpOutboxService.flushRedisOutbox();
    }
}
