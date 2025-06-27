import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Servir estático: http://localhost:3000/static/images/coffees/latte.png
  app.use('/static', express.static(join(__dirname, '..', 'public')));

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
