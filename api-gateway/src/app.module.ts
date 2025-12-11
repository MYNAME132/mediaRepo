import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpClientService } from './shared/http-client.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth-serivce/auth.module';
import { MediaModule } from './media-service/media.module';
import { UserModule } from './user-service/user.module';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProcessingModule } from './processing-service/processing.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
     AuthModule, MediaModule, UserModule,SharedModule,ProcessingModule],
  controllers: [AppController],
  providers: [HttpClientService,AppService],
})
export class AppModule {}
