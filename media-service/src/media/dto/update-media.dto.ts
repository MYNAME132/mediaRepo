import { IsNotEmpty, IsOptional } from "class-validator";
import { MediaModelType } from "../enitity/media.entity";

export class UpdateMediaDTO {
    @IsOptional()
    modelId?: string;

    @IsOptional()
    modelType?: MediaModelType;

    @IsOptional()
    signedUrl?: boolean = true;
}