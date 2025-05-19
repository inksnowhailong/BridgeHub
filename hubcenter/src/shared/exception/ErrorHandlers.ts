import { HttpException, HttpStatus } from '@nestjs/common';
import {
  BaseErrorHandler,
  IException
} from 'src/domain/exception/base.exception';
import { QueryFailedError, TypeORMError } from 'typeorm';

/**
 * @description: HTTP错误
 * @return {*}
 */
export class HttpExceptionErrorHandler extends BaseErrorHandler {
  transformError(error: Error, result: IException<any>): IException<any> {
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
  transformError(error: Error, result: IException<any>): IException<any> {
    if (error instanceof TypeORMError) {
      const code = (error as any).code;
      const { status, message } = this.codeToMessage(code);
      result = {
        error,
        message: message,
        code: status,
        detail: {
          code
        }
      };
    }
    return result;
  }

  codeToMessage(code: string): { status: number; message: string } {
    let message, status;
    console.log(message);

    switch (code) {
      case '23505':
        message = '服务重复注册';
        status = HttpStatus.CONFLICT;
        break;
      case '23503':
        message = '您尝试操作的数据与现有数据不匹配，请检查相关数据。';
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      case '23502':
        message = '此项数据不能为空，请填写该字段。';
        status = HttpStatus.BAD_REQUEST;
        break;
      case '23514':
        message = '数据输入不符合规定，请检查输入内容。';
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      case '23508':
        message = '操作的内容与现有数据重复，请确认该项数据唯一。';
        status = HttpStatus.CONFLICT;
        break;
      case '23509':
        message = '此数据与其他数据存在冲突，请检查数据关系。';
        status = HttpStatus.CONFLICT;
        break;
      case '23510':
        message = '操作失败，数据间存在关联限制，请检查数据依赖。';
        status = HttpStatus.BAD_REQUEST;
        break;
      case '23511':
        message = '操作触发了系统规则，请检查相关设定。';
        status = HttpStatus.BAD_REQUEST;
        break;
      case '23512':
        message = '操作的数据存在关联限制，请检查数据一致性。';
        status = HttpStatus.BAD_REQUEST;
        break;
      case '23513':
        message = '数据不符合规定，请检查输入内容。';
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      default:
        message = 'Internal Server Error';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return { status, message };
  }
}

/**
 * @description: 默认错误处理
 * @return {*}
 */
export class DefaultErrorHandler extends BaseErrorHandler {
  transformError(error: Error, result: IException<any>): IException<any> {
    console.log(error);

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
