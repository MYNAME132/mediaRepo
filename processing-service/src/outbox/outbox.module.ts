import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpOutboxService } from './outbox.service';
import { OutboxCronService } from './outbox.controller';
import { Outbox } from './entity/outbox.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../config/redis.module';

@Module({
    imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Outbox]),RedisModule],
    providers: [HttpOutboxService, OutboxCronService],
    exports: [HttpOutboxService],
})
export class OutboxModule { }
