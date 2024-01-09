import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// const cookieSession = require('cookie-session');

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['okfsfaf'], // random string to encrypt plain object into cookie
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Make sure don't have any extra properties in data (remove it)
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
