export interface IException<T> {
  error: T;
  message: string;
  detail?: Record<string, any>;
  code: number;
}

/**
 * @description: 错误处理类
 * @return {*}
 */
export abstract class ErrorHandler {
  protected nextHandler?: ErrorHandler;

  setNext(handler: ErrorHandler): ErrorHandler {
    this.nextHandler = handler;
    return handler;
  }

  abstract handle(error: Error, preResult?: IException<any>): IException<any>;
}

/**
 * @description: 基础错误处理类，已实现handle的链式调用 责任链模式
 * @return {*}
 */
export abstract class BaseErrorHandler extends ErrorHandler {
  handle(error: Error, preResult: IException<any>) {
    let result = preResult;
    result = this.transformError(error, result);
    if (this.nextHandler) {
      return this.nextHandler.handle(error, result);
    }
    return result;
  }

  abstract transformError(
    error: Error,
    result: IException<any>
  ): IException<any>;
}

/**
 * @description: 错误处理器
 * @return {*}
 */
export abstract class ExceptionParser {
  protected handlerHead: ErrorHandler;
  setHander(handlerHead: ErrorHandler) {
    this.handlerHead = handlerHead;
  }
  abstract parseError<T extends Error>(error: T): IException<T>;
}
