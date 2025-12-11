import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { HttpClientService } from '../shared/http-client.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UsersService, HttpClientService],
})
export class UserModule {}