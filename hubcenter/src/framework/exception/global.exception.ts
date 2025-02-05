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
    // const request = ctx.getRequest<Request>();
    console.log('exception :>> ', exception);
    const { code, error, message, detail } =
      this.exceptionParser.parseError(exception);
    response.status(code).json(new ResponseDTO(code, message, error));
  }
}
