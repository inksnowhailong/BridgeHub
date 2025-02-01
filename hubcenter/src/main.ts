import { NestFactory } from '@nestjs/core';
import { AppModule } from './framework/app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestInterceptor } from './framework/Interceptor/Request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
  app.useGlobalInterceptors(new RequestInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
