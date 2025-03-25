/**
 * @description: 响应数据标准结构
 * @return {*}
 */
export class ResponseDTO {
  /**状态码 */
  code: number;
  /**消息 */
  message: string;
  /**数据 */
  data: any;
  /**时间戳 */
  timestamp: number;

  constructor(code: number, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }
}
