import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDTO } from 'src/domain/dto/response.dto';
import { ExceptionParser } from 'src/domain/exception/base.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly exceptionParser: ExceptionParser) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, error, message, detail } =
      this.exceptionParser.parseError(exception);
    console.log(error);

    response
      .status(code)
      .json(
        new ResponseDTO(
          code,
          message,
          process.env.NODE_ENV === 'production' ? {} : error
        )
      );
  }
}
