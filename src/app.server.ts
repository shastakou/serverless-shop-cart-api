import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { PrismaService } from 'nestjs-prisma';

import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function createServer(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(helmet());

  await prismaService.enableShutdownHooks(app);

  return app;
}

export { createServer };
