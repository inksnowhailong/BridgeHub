import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ErrorHandler,
  ExceptionParser,
  IException
} from 'src/domain/exception/base.exception';

export class NestException extends ExceptionParser {
  parseError<T extends Error>(error: T): IException<T> {
    return this.handlerHead.handle(error);
  }
  LinkErrhandlers(handlers: ErrorHandler[]) {
    handlers.reduce((pre, cur) => {
      pre.setNext(cur);
      return cur;
    });
    this.setHander(handlers[0]);
  }
}
