import { NestFactory } from '@nestjs/core';
import { AppModule } from './framework/app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestInterceptor } from './framework/Interceptor/Request.interceptor';
import { AllExceptionFilter } from './framework/exception/global.exception';
import { NestException } from './shared/exception/nest.exception';
import {
  DefaultErrorHandler,
  HttpExceptionErrorHandler,
  TypeormExceptionErrorHandler
} from './shared/exception/ErrorHandlers';

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
      // whitelist: true,
      transform: true
    })
  );
  app.useGlobalInterceptors(new RequestInterceptor());

  const nestException = new NestException();
  // 错误处理器 进行链接
  nestException.LinkErrhandlers([
    new HttpExceptionErrorHandler(),
    new TypeormExceptionErrorHandler(),
    new DefaultErrorHandler()
  ]);
  app.useGlobalFilters(new AllExceptionFilter(nestException));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
