import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет лишние свойства из запроса
      forbidNonWhitelisted: true, // Запрещает неопределенные свойства
      transform: true, // Преобразует типы данных
    }),
  );
  await app.listen(3000);
}
bootstrap();
