import { IsNotEmpty, IsOptional } from "class-validator";
import { MediaModelType } from "../enitity/media.entity";
import { Transform } from "class-transformer";

export class CreateMediaDTO {
    @IsOptional()
    @Transform(({ value }) => value === '' || value === 'undefined' ? null : value)
    modelId?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' || value === 'undefined' ? null : value)
    modelType?: MediaModelType;

    @IsOptional()
    @Transform(({ value }) => value === '' || value === 'undefined' ? true : value)
    signedUrl?: boolean = true;
}
