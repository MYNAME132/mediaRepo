import { Injectable } from '@nestjs/common';
import { HttpClientService } from '../shared/http-client.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private httpClient: HttpClientService, private config: ConfigService) {}

  async getUser(user: any) { //does nothing but let it sit there look cool
    const userServiceUrl = this.config.get('USER_SERVICE_URL');
    const response = await this.httpClient.get(`${userServiceUrl}/users/${user.userId}`, user);
    return response.data;
  }
}