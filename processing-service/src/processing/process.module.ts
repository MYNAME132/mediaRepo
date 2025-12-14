import { Module } from '@nestjs/common';
import { ProcessingController } from './process.controller';
import { ProcessingService } from '../processing/process.service';
import { DownloaderService } from '../processing/download.file';
import { AIService } from '../processing/aibuffer';
import { MediaClientService } from '../http-service/media.service';
import { MediaUploadService } from '../http-service/media-update.service';
import { OutboxModule } from '../outbox/outbox.module';
import { HttpOutboxService } from '../outbox/outbox.service';
import { RedisModule } from '../config/redis.module';
import { Outbox } from '../outbox/entity/outbox.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [OutboxModule,TypeOrmModule.forFeature([Outbox]), 
        OutboxModule,                       
        RedisModule,],
    controllers: [ProcessingController],
    providers: [
        ProcessingService,
        DownloaderService,
        AIService,
        MediaClientService,
        MediaUploadService,
        HttpOutboxService,
    ],
    exports: [ProcessingService],
})
export class ProcessingModule { }
