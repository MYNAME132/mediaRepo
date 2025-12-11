import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProcessMediaParamDto {
    @ApiProperty({ description: 'UUID of the media to process' })
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
