import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { MailsModule } from './mails/mails.module';
import JWTConfig from "./config/config.jwt";
import NestConfig from "./config/config.nest";
import DatabaseConfig from './config/config.database';
import MailerConfig from './config/config.mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load : [NestConfig, DatabaseConfig, JWTConfig, MailerConfig]
    }),
    DatabaseModule,
    AuthModule,
    TodoModule,
    MailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
