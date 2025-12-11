import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
    @ApiProperty({ required: false, description: 'Type of the media' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value === '' ? undefined : value))
    type?: string;

    @ApiProperty({ required: false, description: 'Optional model ID' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value === '' ? undefined : value))
    modelId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value === '' ? undefined : value))
    modelType?: string;
}
