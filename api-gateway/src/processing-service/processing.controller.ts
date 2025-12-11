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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcessMediaResponseDto } from './dto/respons.dto';
import { ProcessMediaParamDto } from './dto/create.dto';

@ApiTags('Processing')
@Controller('process')
export class ProcessingController {
  constructor(private httpClient: HttpClientService) { }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process an image with AI' })
  @ApiOkResponse({ type: ProcessMediaResponseDto })
  async processMedia(@Param() params: ProcessMediaParamDto, @Req() req) {
    const user = req.user;

    const processingServiceUrl =
      process.env.PROCESSING_SERVICE_URL || 'http://processing-service:3000';

    const response = await this.httpClient.post(
      `${processingServiceUrl}/process/${params.id}`,
      user,
      {},
    );

    return response.data;
  }
}
