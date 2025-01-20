import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// import { ExpressAdapter } from '@nestjs/platform-express';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // // Server Express
  // const appExpress = await NestFactory.create(AppModule, new ExpressAdapter());
  // const configServiceE = appExpress.get(ConfigService);
  // const hostExpress = configServiceE.get<string>('appExpress.host');
  // const portExpress = configServiceE.get<number>('appExpress.port');

  // await appExpress.listen(portExpress, hostExpress);
  // console.log(`Express Server is running on http://${hostExpress}:${portExpress}`);

  // Server Fastify
  const appFastify = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configServiceF = appFastify.get(ConfigService);
  const hostFastify = configServiceF.get<string>('appFastify.host');
  const portFastify = configServiceF.get<number>('appFastify.port');

  // appFastify.useGlobalPipes(new ValidationPipe())
  appFastify.setGlobalPrefix('api');

  await appFastify.listen(portFastify, hostFastify);
  console.log(`Fastify Server is running on http://${hostFastify}:${portFastify}`);
}
bootstrap();
