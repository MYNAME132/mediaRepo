import { Injectable } from '@nestjs/common';
import { MediaClientService } from '../http-service/media.service';
import { DataSource, EntityManager } from 'typeorm';
import { DownloaderService } from './download.file';
import { AIService } from './aibuffer';
import { MediaUploadService } from '../http-service/media-update.service';
import { HttpOutboxService } from '../outbox/outbox.service';

@Injectable()
export class ProcessingService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly mediaClient: MediaClientService,
        private readonly downloader: DownloaderService,
        private readonly aiService: AIService,
        private readonly mediaUploadService: MediaUploadService,
        private readonly httpOutbox: HttpOutboxService, 
    ) { }

    async process(mediaId: string, orgId: string) {
        return this.dataSource.transaction(async (manager: EntityManager) => {
            console.log('[PROCESS] Starting transaction...');

            const media = await this.mediaClient.getMedia(mediaId, orgId);
            console.log('[PROCESS] Media:', media);

            const fileBuffer = await this.downloader.downloadFile(media.signedUrl);
            console.log(`[PROCESS] fileBuffer length = ${fileBuffer.length}`);

            const processedBuffer = await this.aiService.process(fileBuffer, media.type);
            console.log('[PROCESS] AI model completed');

            const newFileName = `processed-${media.name}`;
            
            const updatePayload = {
                mediaId,
                buffer: processedBuffer.toString('base64'),
                filename: newFileName,
                mimeType: media.type,
                orgId,
                updateMediaDTO: {
                    modelId: media.modelId,
                    modelType: media.modelType,
                    signedUrl: true,
                }
            };
            await this.httpOutbox.sendHttpEvent(
                'media/update', 
                updatePayload,
                'media',
                manager
            );

            console.log('[PROCESS] Update request saved to outbox');

            return {
                status: 'ok',
                updated: newFileName,
            };
        });
    }
}
