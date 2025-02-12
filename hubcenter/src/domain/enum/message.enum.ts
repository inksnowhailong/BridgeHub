/**
 * @description: 接收消息类型
 * @return {*}
 */
export enum MessageType {
  PUBLISHER_START = 'PUBLISHER_START',
  PUBLISHER_CREATE = 'PUBLISHER_CREATE'
}

/**发送消息类型 */
export enum SendType {
  PUBLISHER_CLOSE = 'PUBLISHER_CLOSE'
}
