import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, HttpException, Get, Param, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-serivce/auth.gurard';
import { HttpClientService } from '../shared/http-client.service';
import { ConfigService } from '@nestjs/config';
import { RateLimitService } from '../shared/ratelimit.service';
import { UsageTracingInterceptor } from '../shared/tracing.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import * as FormData from 'form-data';
import axios from 'axios';
import { Readable } from 'stream';
import { UploadMediaDto } from './dto/upload.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { MediaItemDto } from './dto/respons.dto';
import { UpdateMediaDto } from './dto/update.dto';

@Controller('media')
export class MediaController {
  constructor(private httpClient: HttpClientService,
     private config: ConfigService,
    private rateLimit:RateLimitService) {}

  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(UsageTracingInterceptor)
  // @Post('upload')
  // async uploadMedia(@Body() body: any, @Req() req) {
  //   const user = req.user;

  //   console.log('User in controller:', user);
  //   await this.rateLimit.checkLimit(user.userId, 'upload', 5, 60);
    
  //   const mediaServiceUrl = this.config.get('MEDIA_SERVICE_URL');
  //   const response = await this.httpClient.post(`${mediaServiceUrl}/media/upload`, user, body);
  //   return response.data;
  // }


  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UsageTracingInterceptor, FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMediaDto })
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadMediaDto,
    @Req() req,
  ) {
    console.log('User from request:', req.user);
    const user = req.user;
    await this.rateLimit.checkLimit(user.userId, 'upload', 5, 60);

    const mediaServiceUrl =
      this.config.get('MEDIA_SERVICE_URL') || 'http://media-service:3000';
    const formData = new FormData();

    if (file) {
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      

      formData.append('file', readable, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size,
      });
    }

    Object.keys(body || {}).forEach((key) => {
      if (key !== 'file') formData.append(key, body[key]);
    });

    const response = await this.httpClient.post(`${mediaServiceUrl}/media/upload`, req.user, formData);

    console.log('Response from media service:', response.data);
    return response.data;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: MediaItemDto, isArray: true })
  async getAll(@Req() req): Promise<MediaItemDto[]> {
    const user = req.user;
    console.log('User from request:', user);

    await this.rateLimit.checkLimit(user.userId, 'get', 5, 60);

    const mediaServiceUrl =
      this.config.get('MEDIA_SERVICE_URL') || 'http://media-service:3000';

    const response = await this.httpClient.get(`${mediaServiceUrl}/media`, user);
    console.log('Response from media service:', response.data);

    return response.data;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UsageTracingInterceptor, FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMediaDto })
  async updateMedia(
    @Param('id') mediaId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req,
  ) {
    const user = req.user;

    await this.rateLimit.checkLimit(user.userId, 'update', 5, 60);

    const mediaServiceUrl =
      this.config.get('MEDIA_SERVICE_URL') || 'http://media-service:3000';

    const formData = new FormData();

    if (file) {
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);

      formData.append('file', readable, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size,
      });
    }

    

    Object.keys(body || {}).forEach((key) => {
      if (key !== 'file') formData.append(key, body[key]);
    });

    const response = await this.httpClient.put(
      `${mediaServiceUrl}/media/${mediaId}`,
      user,
      formData,
    );
    

    return response.data;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  
  async getMediaById(
    @Param('id') mediaId: string,
    @Req() req,
  ):Promise<MediaItemDto> {
    const user = req.user;

    const mediaServiceUrl =
      this.config.get('MEDIA_SERVICE_URL') || 'http://media-service:3000';

    const url = `${mediaServiceUrl}/media/${mediaId}`;
    const response = await this.httpClient.get(url, user);

    return response.data;
  }
}
