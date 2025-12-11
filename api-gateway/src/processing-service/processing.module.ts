import { Module } from '@nestjs/common';
import { ProcessingController } from './processing.controller';
import { HttpClientService } from '../shared/http-client.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../shared/shared.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [SharedModule,ConfigModule,CacheModule.register()],
  controllers: [ProcessingController],
  providers: [HttpClientService],
})
export class ProcessingModule {}