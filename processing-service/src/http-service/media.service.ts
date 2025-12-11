
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MediaClientService {
    private readonly MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL 

    async getMedia(id: string, orgId: string) {
        if (!orgId) {
            throw new Error('Organization ID is required');
        }
        console.log('MEDIA_SERVICE_URL:', this.MEDIA_SERVICE_URL);
        console.log('Final request URL:', `${this.MEDIA_SERVICE_URL}/media/${id}`);

        const response = await axios.get(`${this.MEDIA_SERVICE_URL}/media/${id}`, {
            headers: {
                'x-organization': orgId,
            },
        });

        const media = response.data;

        return media;
    }
}
