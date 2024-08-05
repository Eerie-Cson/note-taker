import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3200;
  await app.listen(port);

  Logger.log(`🚀 note-taker-app is running on: http://0.0.0.0:${port}`);
}
bootstrap();
