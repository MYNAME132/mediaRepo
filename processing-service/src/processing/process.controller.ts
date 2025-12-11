import { Controller, Post, Param, Headers, BadRequestException } from '@nestjs/common';
import { ProcessingService } from './process.service';

@Controller('process')
export class ProcessingController {
    constructor(private readonly processingService: ProcessingService) { }

    @Post(':id')
    async handle(
        @Param('id') id: string,
        @Headers('x-organization') orgId: string,
    ) {
        if (!orgId) {
            throw new BadRequestException('x-organization header missing');
        }

        return this.processingService.process(id, orgId);
    }
}
