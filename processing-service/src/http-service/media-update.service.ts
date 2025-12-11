import { Injectable } from '@nestjs/common';
import axios from 'axios';
const FormData = require('form-data');

@Injectable()
export class MediaUploadService {
    private readonly MEDIA_SERVICE_URL =
        process.env.MEDIA_SERVICE_URL || 'http://media-service:3000';

    async updateMediaFile(
        mediaId: string,
        buffer: Buffer,
        filename: string,
        mimeType: string,
        orgId: string,
        updateMediaDTO: Record<string, any> = {}
    ) {
        const form = new FormData();

        form.append('file', buffer, {
            filename,
            contentType: mimeType,
        });

        for (const key of Object.keys(updateMediaDTO)) {
            const value = updateMediaDTO[key];
            form.append(key, value !== undefined && value !== null ? String(value) : '');
        }

        const formBuffer = form.getBuffer();
        const formHeaders = form.getHeaders();

        try {
            const response = await axios.put(
                `${this.MEDIA_SERVICE_URL}/media/${mediaId}`,
                formBuffer,
                {
                    headers: {
                        ...formHeaders,
                        'x-organization': orgId,
                        'Content-Length': formBuffer.length,
                    },
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('media update failed:', error?.response?.data || error.message);
            throw new Error('Failed to update media file');
        }
    }
}
