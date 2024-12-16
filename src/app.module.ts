import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import NestConfig from "./config/config.nest";
import DatabaseConfig from './config/config.database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load : [NestConfig, DatabaseConfig]
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
