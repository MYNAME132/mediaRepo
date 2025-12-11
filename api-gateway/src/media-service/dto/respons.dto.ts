import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class MediaItemDto {
    @ApiProperty()
    @IsOptional()
    id: string;

    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    type: string;

    @ApiProperty()
    @IsOptional()
    url: string;
}
