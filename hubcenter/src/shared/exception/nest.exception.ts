import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ErrorHandler,
  ExceptionParser,
  IException
} from 'src/domain/exception/base.exception';

export class NestException extends ExceptionParser {
  /**
   * @description: 从头使用错误处理器一个一个进行处理
   * @param {T} error
   * @return {*}
   */
  parseError<T extends Error>(error: T): IException<T> {
    return this.handlerHead.handle(error);
  }

  /**
   * @description: 链接多个错误处理器
   * @param {ErrorHandler} handlers
   * @return {*}
   */
  LinkErrhandlers(handlers: ErrorHandler[]) {
    handlers.reduce((pre, cur) => {
      pre.setNext(cur);
      return cur;
    });
    this.setHander(handlers[0]);
  }
}
