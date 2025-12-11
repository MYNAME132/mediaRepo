import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
    private client: Client;
    private bucket: string;

    constructor(private config: ConfigService) {
        const conf = config.get('minio');

        this.client = new Client({
            endPoint: conf.endPoint,
            port: conf.port,
            useSSL: conf.useSSL,
            accessKey: conf.accessKey,
            secretKey: conf.secretKey,
        });

        this.bucket = conf.bucket;
        this.ensureBucket();
    }

    private async ensureBucket() {
        const exists = await this.client.bucketExists(this.bucket);
        if (!exists) {
            await this.client.makeBucket(this.bucket, 'us-east-1');
            console.log(`Created bucket ${this.bucket}`);
        }
    }

    async upload(key: string, buffer: Buffer, mimeType: string) {
        return this.client.putObject(
            this.bucket,
            key,
            buffer,
            buffer.length,
            {
                'Content-Type': mimeType,
            },
        );
    }


    async getSignedUrl(key: string, expiry = 60 * 60) {
        return this.client.presignedGetObject(this.bucket, key, expiry);
    }

    async delete(key: string) {
        return this.client.removeObject(this.bucket, key);
    }
}
