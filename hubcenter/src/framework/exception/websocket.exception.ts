import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDTO } from 'src/domain/dto/response.dto';
import { ExceptionParser } from 'src/domain/exception/base.exception';

@Catch()
export class WebSocketFilter implements ExceptionFilter {
  constructor(private readonly exceptionParser: ExceptionParser) {}

  catch(exception: Error, host: ArgumentsHost) {
    const wsContext = host.switchToWs();
    const client = wsContext.getClient();
    const { code, error, message, detail } =
      this.exceptionParser.parseError(exception);

    const response = new ResponseDTO(
      code,
      message,
      process.env.NODE_ENV === 'production' ? {} : error
    );
    client.emit('message', response);
  }
}
