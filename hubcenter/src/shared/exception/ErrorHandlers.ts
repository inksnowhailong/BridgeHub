import { HttpException, HttpStatus } from '@nestjs/common';
import {
  BaseErrorHandler,
  IException
} from 'src/domain/exception/base.exception';
import { TypeORMError } from 'typeorm';

/**
 * @description: HTTP错误
 * @return {*}
 */
export class HttpExceptionErrorHandler extends BaseErrorHandler {
  transeformError(error: Error, result: IException<any>): IException<any> {
    let status, message;

    if (error instanceof HttpException) {
      status = error.getStatus();
      message = error.getResponse();
      result = {
        error,
        message: message,
        code: status
      };
    }
    return result;
  }
}

/**
 * @description: 数据库错误
 * @return {*}
 */
export class TypeormExceptionErrorHandler extends BaseErrorHandler {
  transeformError(error: Error, result: IException<any>): IException<any> {
    let status, message;
    if (error instanceof TypeORMError) {
      status = 500;
      message = this.codeToMessage(error.code as number);
      result = {
        error,
        message: message,
        code: status
      };
    }
    return result;
  }

  codeToMessage(code: number): string {
    switch (code) {
      case 23505:
        return '服务名称重复';
      default:
        return 'Internal Server Error';
    }
  }
}

/**
 * @description: 默认错误处理
 * @return {*}
 */
export class DefaultErrorHandler extends BaseErrorHandler {
  transeformError(error: Error, result: IException<any>): IException<any> {
    if (!result.code) {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Internal Server Error';
      result = {
        error,
        message: message,
        code: status,
        detail: {
          time: Date.now()
        }
      };
    }

    return result;
  }
}
