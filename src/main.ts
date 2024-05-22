import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {


  const httpsOptions = {
    key: fs.readFileSync('./src/cert/key.pem', 'utf8'),
    cert: fs.readFileSync('./src/cert/cert.pem', 'utf8'),
  };
  const app = await NestFactory.create(AppModule, {

  });
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle('Tesouraria Digital')
    .setDescription('Integrações')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
