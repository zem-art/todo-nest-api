import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize'; // npm install @nestjs/sequelize sequelize pg pg-hstore
import { SequelizeLoggerService } from './sequelize-logger.service';
import { MongooseLoggerService } from './mongoose-logger.service';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'; // npm install @nestjs-modules/ioredis ioredis
import { RedisLoggerService } from './redis-logger.service';

@Module({
  imports: [
    ConfigModule,

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbUrl = configService.get<string>('mongodb.url');
        const dbPort = configService.get<string>('mongodb.port');
        const dbUser = configService.get<string>('mongodb.user');
        const dbPassword = configService.get<string>('mongodb.pass');
        const dbDirect = configService.get<string>('mongodb.direct');
        const dbAuth = configService.get<string>('mongodb.auth');
        let dbName = configService.get<string>('mongodb.name');
        const envFastify = configService.get<string>('appFastify.env');

        if (envFastify) dbName = dbName + `-${envFastify}`;

        const authParams = new URLSearchParams({
          directConnection: dbDirect,
          authSource: dbAuth,
        }).toString();
        // console.log('authParam ',dbUser, dbPassword, dbUrl, dbPort, dbName, authParams);

        const urlName = dbUser && dbPassword
          ? `mongodb://${dbUser}:${dbPassword}@${dbUrl}:${dbPort}/${dbName}?${authParams}`
          : `mongodb://${dbUrl}:${dbPort}/${dbName}`;

        return {
          uri: urlName,
          autoCreate: true,
        };
      },
      inject: [ConfigService],
    }),

    // Sequelize Connection (PostgreSQL / MySQL)
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'db1', // For PostgreSQL or MySQL connection
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres', // Change to 'mysql' if using MySQL
        host: configService.get<string>('postgres.host'),
        port: parseInt(configService.get<string>('postgres.port'), 10),
        username: configService.get<string>('postgres.user'),
        password: configService.get<string>('postgres.pass'),
        database: configService.get<string>('postgres.name'),
        autoLoadModels: true,
        synchronize: true, // WARNING: true hanya untuk dev
        logging: (msg) => {
          if (!msg.includes('SELECT 1+1')) {
            console.log('SQL:', msg);
          }
        } // Uncomment if you want to log SQL queries
        // logging: false, // 👉 matikan log query seperti "SELECT 1+1 AS result"
      }),
    }),

    // Redis Connection
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => ({
        type: 'single', // Jenis koneksi Redis ('single', 'cluster', 'sentinel')
        url: configService.get<string>('redis.host') || 'localhost',
        options: {
          port: parseInt(configService.get<string>('redis.port'), 10) || 6379,
          password: configService.get<string>('redis.pass') || undefined,
          db: parseInt(configService.get<string>('redis.db'), 10) || 0,
        },
      }),
    }),

  ],
  providers: [
    SequelizeLoggerService, // Uncomment if you want to use SequelizeLoggerService
    MongooseLoggerService, // Uncomment if you want to use MongooseLoggerService
    RedisLoggerService, // Uncomment if you want to use RedisLoggerService
  ],
})
export class DatabaseModule {}
