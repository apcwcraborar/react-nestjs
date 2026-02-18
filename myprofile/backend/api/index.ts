import 'dotenv/config';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

const server = express();
let appPromise: Promise<void> | null = null;

async function bootstrap() {
  if (!appPromise) {
    appPromise = (async () => {
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

      app.enableCors({
        origin: process.env.FRONTEND_URL ?? '*',
      });

      await app.init();
    })();
  }

  await appPromise;
}

export default async function handler(req: express.Request, res: express.Response) {
  await bootstrap();
  server(req, res);
}
