import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaController } from './media/media.controller';
import { AppDataSource } from './config/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from './media/minio/minio.module';
import { ConfigModule } from '@nestjs/config';
import minioConfig from './config/minio.config';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [minioConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }), MinioModule, MediaModule
  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
