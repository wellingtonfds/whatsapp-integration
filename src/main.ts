import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const config = new DocumentBuilder()
    .setTitle('Tesouraria Digital')
    .setDescription('Integrações')
    .setVersion('1.0')
    .addServer('https://tesourariadigitaludv-production-a7fb.up.railway.app')
    .addServer('http://localhost:3000')
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
