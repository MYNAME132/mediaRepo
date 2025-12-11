import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Media } from './enitity/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateMediaDTO } from './dto/create-media.dto';
import { MinioService } from './minio/minio.service';
import { MediaContextService } from './media.context.service';

@Injectable()
export class MediaService {
    constructor(@InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
                @Inject('MINIO_CLIENT') private readonly minioClient: any,
                private readonly configService: ConfigService,
                private readonly minioService: MinioService,
                private readonly mediaContext: MediaContextService,) { }
    
    async create(
        file: Express.Multer.File,
        createMediaDTO?: CreateMediaDTO,
        organizationId?: string,
    ) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const bucket = this.configService.get<string>('minio.bucket') || 'media';

        await this.minioClient.putObject(bucket, file.originalname, file.buffer, {
            'Content-Type': file.mimetype,
        });

        const media = this.mediaRepository.create({
            name: file.originalname,
            type: file.mimetype,
            modelId: createMediaDTO?.modelId,
            modelType: createMediaDTO?.modelType,
            link: file.originalname,
            organizationId,
        });

        await this.mediaRepository.save(media);

        if (createMediaDTO?.signedUrl) {
            const expires = 60 * 60;
            const signedUrl = await this.minioClient.presignedUrl(
                'GET',
                bucket,
                file.originalname,
                expires,
            );
            return { ...media, signedUrl };
        }

        return media;
    }


    async getAll(): Promise<Media[]> {
        const orgId = this.mediaContext.getOrganizationId();

        const mediaList = await this.mediaRepository.find({
            where: { organizationId: orgId },
            order: { createdAt: 'DESC' },
        });

        const result = await Promise.all(
            mediaList.map(async (media) => {
                const signedUrl = media.link
                    ? await this.minioService.getSignedUrl(media.link)
                    : null;
                return {
                    ...media,
                    signedUrl,
                };
            }),
        );

        return result;
    }

    async update(
        mediaId: string,
        file: Express.Multer.File,
        updateMediaDTO: CreateMediaDTO,
        organizationId: string,
    ) {
        const media = await this.mediaRepository.findOne({
            where: { id: mediaId, organizationId },
        });

        if (!media) {
            throw new NotFoundException('Media not found or access denied');
        }

        if (file) {
            const bucket = this.configService.get<string>('minio.bucket') || 'media';
            await this.minioClient.putObject(bucket, file.originalname, file.buffer, {
                'Content-Type': file.mimetype,
            });
            media.name = file.originalname;
            media.type = file.mimetype;
            media.link = `${bucket}/${file.originalname}`;
        }
        if (updateMediaDTO?.modelId){ 
            media.modelId = updateMediaDTO.modelId;
        }
        if (updateMediaDTO?.modelType){
             media.modelType = updateMediaDTO.modelType;
        }

        await this.mediaRepository.save(media);

        let signedUrl = null;
        if (updateMediaDTO?.signedUrl) {
            const expires = 60 * 60; 
            signedUrl = await this.minioClient.presignedUrl('GET', media.link.split('/')[0], media.name, expires);
        }

        return { ...media, signedUrl };
    }

    async findOne(id: string, orgId: string) {
        const media = await this.mediaRepository.findOne({
            where: { id, organizationId: orgId },
        });

        if (!media) {
            throw new NotFoundException('Media not found or access denied');
        }
        const signedUrl = media.link
            ? await this.minioService.getSignedUrl(media.link)
            : null;

        return {
            ...media,
            signedUrl,
        };
    }

}
