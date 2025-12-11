import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UserUpadteDto {
    @IsOptional()
    @ApiProperty  ({ example: 'John Doe'})
    name?: string;

    @IsOptional() 
    @ApiProperty({ example: 'strongPassword123'})
    password?: string;
    
    @IsOptional()
    @ApiProperty({ example: 'ordID' })//should be UUID v4 but let it be just string
    organization?: string;
}