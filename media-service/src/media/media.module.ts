import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media } from './enitity/media.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from './minio/minio.module';
import { MediaContextService } from './media.context.service';

    @Module({
        imports: [ConfigModule, TypeOrmModule.forFeature([Media,]),MinioModule,],
        providers: [
            MediaService,MediaContextService,
            {
                provide: 'MINIO_CLIENT',
                useFactory: (configService: ConfigService) => {
                    const Minio = require('minio');
                    return new Minio.Client({
                        endPoint: configService.get<string>('minio.endPoint'),
                        port: configService.get<number>('minio.port'),
                        useSSL: configService.get<boolean>('minio.useSSL'),
                        accessKey: configService.get<string>('minio.accessKey'),
                        secretKey: configService.get<string>('minio.secretKey'),
                    });
                },
                inject: [ConfigService],
            },
        ],
        controllers: [MediaController],
        exports: [MediaService],
    })
    export class MediaModule { }