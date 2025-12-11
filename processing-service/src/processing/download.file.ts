import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class DownloaderService {
    async downloadFile(signedUrl: string): Promise<Buffer> {
        try {
            console.log('[Downloader] Downloading URL:', signedUrl); 
            const response = await axios.get(signedUrl, {
                responseType: 'arraybuffer',
            });
            return Buffer.from(response.data);
        } catch (error) {
            throw new Error(`Failed to download file: ${error.message}`);
        }
    }
}