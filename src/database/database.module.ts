import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { RedisModule } from '@nestjs-modules/ioredis'; // npm install @nestjs-modules/ioredis ioredis

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

    // // Sequelize Connection (PostgreSQL / MySQL)
    // SequelizeModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   name: 'db1', // For PostgreSQL or MySQL connection
    //   useFactory: async (configService: ConfigService) => ({
    //     dialect: 'postgres', // Change to 'mysql' if using MySQL
    //     host: configService.get<string>('postgres.host'),
    //     port: parseInt(configService.get<string>('postgres.port'), 10),
    //     username: configService.get<string>('postgres.user'),
    //     password: configService.get<string>('postgres.pass'),
    //     database: configService.get<string>('postgres.name'),
    //     autoLoadModels: true,
    //     synchronize: true, // WARNING: true hanya untuk dev
    //   }),
    // }),

    // // Redis Connection
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     config: {
    //       host: configService.get<string>('redis.host'),
    //       port: parseInt(configService.get<string>('redis.port'), 10),
    //       password: configService.get<string>('redis.pass'),
    //       db: parseInt(configService.get<string>('redis.db'), 10) || 0,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
})
export class DatabaseModule {}
