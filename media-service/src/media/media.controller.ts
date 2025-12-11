import { Body, Controller,Post, Headers, UseInterceptors, UploadedFile, Get, Req, Query, BadRequestException, Put, Param } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMediaDTO } from './dto/create-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService : MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMediaDTO: CreateMediaDTO,
    @Headers('x-organization') orgId: string,
  ) {
    if (!orgId) {
      throw new BadRequestException('Organization ID header is required');
    }

    return this.mediaService.create(file, createMediaDTO, orgId);
  }
  @Get()
  async getAll(@Headers('x-organization') orgId: string) {
    console.log('OrganizationId received from header:', orgId);
    return this.mediaService.getAll();
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateMedia(
    @Param('id') mediaId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMediaDTO: CreateMediaDTO,
    @Headers('x-organization') orgId: string,
  ) {
    if (!orgId) throw new BadRequestException('Organization ID header is required');

    return this.mediaService.update(mediaId, file, updateMediaDTO, orgId,);
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Headers('x-organization') orgId: string,
  ) {
    if (!orgId) {
      throw new BadRequestException('Organization ID header is required');
    }

    return this.mediaService.findOne(id, orgId);
  }


  // @Post('upload')
  // upload(@Body() body: any, @Headers('x-user-id') userId: string) {
  //   console.log('User ID:', userId);
  //   console.log('Media body:', body);
  //   return { status: 'ok', message: 'Media uploaded successfully' };
  // }
}