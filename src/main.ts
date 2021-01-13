import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');


  const options = new DocumentBuilder()
    .setTitle('SANGSANG MARU API')
    .setDescription('The SANGSANG MARU API description')
    .setVersion('1.0')
    .addServer('https')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(8000);

}
bootstrap();
