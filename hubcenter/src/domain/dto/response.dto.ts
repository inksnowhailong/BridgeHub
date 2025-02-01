/**
 * @description: 响应数据标准结构
 * @return {*}
 */
export interface ResponseDTO {
  /**状态码 */
  code: number;
  /**消息 */
  message: string;
  /**数据 */
  data: any;
  /**时间戳 */
  timestamp: number;
}
