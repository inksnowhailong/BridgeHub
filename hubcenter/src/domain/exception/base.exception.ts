export interface IException<T> {
  error: T;
  message: string;
  detail?: Record<string, any>;
  code: number;
}

export abstract class ErrorHandler {
  protected nextHandler?: ErrorHandler;

  setNext(handler: ErrorHandler): ErrorHandler {
    this.nextHandler = handler;
    return handler;
  }

  abstract handle(error: Error, preResult?: IException<any>): IException<any>;
}

export abstract class BaseErrorHandler extends ErrorHandler {
  handle(error: Error, preResult: IException<any>) {
    let result = preResult;
    result = this.transeformError(error, result);
    if (this.nextHandler) {
      return this.nextHandler.handle(error, result);
    }
    return result;
  }

  abstract transeformError(
    error: Error,
    result: IException<any>
  ): IException<any>;
}

export abstract class ExceptionParser {
  protected handlerHead: ErrorHandler;
  setHander(handlerHead: ErrorHandler) {
    this.handlerHead = handlerHead;
  }
  abstract parseError<T extends Error>(error: T): IException<T>;
}
