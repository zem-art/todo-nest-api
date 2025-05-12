import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SequelizeLoggerService implements OnModuleInit {
  private readonly logger = new Logger(SequelizeLoggerService.name);

  constructor(
    @InjectConnection('db1') private readonly sequelize: Sequelize,
  ) {}

  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      this.logger.log('✅ PostgreSQL connected successfully (db1)');
    } catch (err) {
      this.logger.error('❌ PostgreSQL connection failed (db1)', err);
    }
  }
}
