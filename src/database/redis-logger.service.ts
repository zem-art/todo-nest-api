import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisLoggerService implements OnModuleInit {
  private readonly logger = new Logger(RedisLoggerService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async onModuleInit() {
    try {
      const result = await this.redis.ping();
      if (result === 'PONG') {
        this.logger.log('✅ Redis connected successfully');
      } else {
        this.logger.warn('⚠️ Redis responded unexpectedly:', result);
      }
    } catch (err) {
      this.logger.error('❌ Redis connection failed', err);
    }
  }
}
