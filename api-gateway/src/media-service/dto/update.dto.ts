import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMediaDto {
    @ApiPropertyOptional({ description: 'Optional media name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Optional model ID' })
    @IsOptional()
    @IsString()
    modelId?: string;

    @ApiPropertyOptional({ description: 'Optional model type' })
    @IsOptional()
    @IsString()
    modelType?: string;
}
