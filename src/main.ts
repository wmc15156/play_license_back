import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config({
    path: process.env.NODE_ENV ? 'production.env' : 'development.env',
  });
  console.log(process.env.COOKIE_SECRET_KEY);
  app.use(
    cors({
      origin: ['http://localhost:3000'],
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
}
bootstrap();
