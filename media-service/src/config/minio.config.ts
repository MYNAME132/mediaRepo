import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => ({
    endPoint: process.env.MINIO_ENDPOINT || 'minio',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_SSL === 'true',
    accessKey: process.env.MINIO_ROOT_USER || 'minio',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minio123',
    bucket: process.env.MINIO_BUCKET || 'media',
}));