import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongooseLoggerService implements OnModuleInit {
  private readonly logger = new Logger(MongooseLoggerService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection, // @InjectConnection() tanpa parameter artinya pakai default MongoDB connection.
  ) {}
  /**
   * Jika kamu pakai multiple MongoDB connection, kamu bisa tambahkan nama koneksi seperti:
   * @InjectConnection('mongo1') private readonly conn: Connection
   */

  async onModuleInit() {
    if (this.connection.readyState === 1) {
      this.logger.log('✅ MongoDB already connected');
    } else {
      this.connection.on('connected', () => {
        this.logger.log('✅ MongoDB connected successfully');
      });

      this.connection.on('error', (err) => {
        this.logger.error('❌ MongoDB connection error:', err);
      });
    }
  }
}
