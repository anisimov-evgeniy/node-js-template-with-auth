import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет свойства, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть "лишние" поля
      transform: true, // Преобразует входные данные в объекты, указанные в DTO
    }),
  );

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Mom Helper API') // Название вашей API документации
    .setDescription('API for the Mom Helper application') // Описание API
    .setVersion('1.0') // Версия API
    .addBearerAuth(
      {
        type: 'http', // Тип авторизации
        scheme: 'bearer', // Схема аутентификации
        bearerFormat: 'JWT', // Формат токена, можно указать 'JWT' (необязательно)
      },
      'access-token', // Название схемы, можно использовать для обозначения токена в Swagger UI
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // URL для Swagger: /api

  app.enableCors(); // Включение CORS
  await app.listen(3001);
}
bootstrap();
