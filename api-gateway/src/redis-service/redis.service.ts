import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379,
      db: Number(process.env.REDIS_DB) || 0,
    });

    this.client.on('error', (err) => console.error('Redis client error', err && err.message ? err.message : err));
  }

  getClient() {
    return this.client;
  }

  async lPush(key: string, value: string) {
    if (typeof (this.client as any).lpush === 'function') {
      return (this.client as any).lpush(key, value);
    }
    if (typeof (this.client as any).lPush === 'function') {
      return (this.client as any).lPush(key, value);
    }
    return (this.client as any).rpush(key, value);
  }

  async lTrim(key: string, start = 0, stop = 99) {
    if (typeof (this.client as any).ltrim === 'function') {
      return (this.client as any).ltrim(key, start, stop);
    }
    if (typeof (this.client as any).lTrim === 'function') {
      return (this.client as any).lTrim(key, start, stop);
    }
    return null;
  }

  async expire(key: string, seconds: number) {
    return this.client.expire(key, seconds);
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch (e) {
      console.log('Error during Redis client shutdown', e && e.message ? e.message : e);
    }
  }
}
