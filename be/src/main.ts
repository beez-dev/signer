import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO - disable all origins for production
  app.enableCors({origin: '*'});
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
