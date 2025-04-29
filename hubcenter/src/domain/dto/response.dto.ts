/**
 * @description: 响应数据标准结构
 * @return {*}
 */
export class ResponseDTO<T = any> {
  /**状态码 */
  code: number;
  /**消息 */
  message: string;
  /**数据 */
  data: T;
  /**时间戳 */
  timestamp: number;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }
}
