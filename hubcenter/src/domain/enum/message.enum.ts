/**
 * @description: 接收消息类型
 * @return {*}
 */
export enum MessageType {
  /**发送apijson数据 */
  PUBLISHER_API_JSON = 'PUBLISHER_API_JSON',
  /**创建发布者 */
  PUBLISHER_CREATE = 'PUBLISHER_CREATE',
  PUBLISHER_START = 'PUBLISHER_START'
}

/**发送消息类型 */
export enum SendType {
  PUBLISHER_CLOSE = 'PUBLISHER_CLOSE'
}
