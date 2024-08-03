import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // Настройка CORS
  const corsOptions: CorsOptions = {
    origin: [process.env.CLIENT_URL, 'http://localhost:3001', 'https://glazovest.ru'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true, // Разрешение на отправку cookie и авторизационных заголовков
  };
  app.enableCors(corsOptions);
  app.useGlobalFilters(new HttpExceptionFilter())

  app.use(cookieParser())

  await app.listen(process.env.PORT)
}
bootstrap()
