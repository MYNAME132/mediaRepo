import { Module } from '@nestjs/common';
import { ProcessingController } from './process.controller';
import { ProcessingService } from '../processing/process.service';
import { DownloaderService } from '../processing/download.file';
import { AIService } from '../processing/aibuffer';
import { MediaClientService } from '../http-service/media.service';
import { MediaUploadService } from '../http-service/media-update.service';
import { OutboxModule } from '../outbox/outbox.module';

@Module({
    imports: [OutboxModule],
    controllers: [ProcessingController],
    providers: [
        ProcessingService,
        DownloaderService,
        AIService,
        MediaClientService,
        MediaUploadService,
    ],
    exports: [ProcessingService],
})
export class ProcessingModule { }
