/**
 * @description: 响应数据工厂
 * @return {*}
 */
export class ResponseFactiry {
  static createResponse(code, message, data) {
    return {
      code,
      message,
      data,
      timestamp: new Date().getTime()
    };
  }
}
