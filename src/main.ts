import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

import { createServer } from './app.server';

async function bootstrap(): Promise<void> {
  const app = await createServer();
  await app.listen(process.env.PORT || 4000);
}

let server: Handler;

async function bootstrapLambda(): Promise<Handler> {
  const app = await createServer();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrapLambda());
  return server(event, context, callback);
};

if (process.env.RUNTIME === 'standalone') {
  bootstrap();
}
