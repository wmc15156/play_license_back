import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

import { AppModule } from './app.module';
// ;(async () => {    })()
(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // 깃헙에서 제거 필
  dotenv.config({
    path: process.env.NODE_ENV ? 'production.env' : 'development.env',
  });

  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://www.shortlysoftware.com', 'https://rufree-junior-p1-sangsang-frontend-swart.vercel.app'],
      credentials: true,
    }),
  );
  app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('SANGSANG MARU API')
    .setDescription('The SANGSANG MARU API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(8000);
})()

