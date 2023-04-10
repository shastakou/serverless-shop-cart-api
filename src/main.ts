import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { PrismaService } from 'nestjs-prisma';

import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  app.enableCors();
  app.use(helmet());

  await prismaService.enableShutdownHooks(app);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
