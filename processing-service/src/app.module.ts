import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessingModule } from './processing/process.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/data-souce';
import { OutboxModule } from './outbox/outbox.module';

@Module({
  imports: [ProcessingModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        console.log('[TypeORM] Connecting with options:', AppDataSource.options);
        return AppDataSource.options;
      },
    }),
    OutboxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
