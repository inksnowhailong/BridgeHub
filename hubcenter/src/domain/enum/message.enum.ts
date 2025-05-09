/**
 * @description: 接收消息类型
 * @return {*}
 */
export enum MessageType {
  /**发送apijson数据 */
  PUBLISHER_API_JSON = 'PUBLISHER_API_JSON',
  /**创建发布者 */
  PUBLISHER_CREATE = 'PUBLISHER_CREATE',
  /**发布者启动 */
  PUBLISHER_START = 'PUBLISHER_START',
  /**发布者关闭 */
  PUBLISHER_CLOSE = 'PUBLISHER_CLOSE',
  /**获取发布者列表 */
  PUBLISHER_LIST = 'PUBLISHER_LIST',
  /**创建订阅者 */
  SUBSCRIBER_CREATE = 'SUBSCRIBER_CREATE',
  /**订阅者启动 */
  SUBSCRIBER_START = 'SUBSCRIBER_START',
  /**订阅者关闭 */
  SUBSCRIBER_CLOSE = 'SUBSCRIBER_CLOSE',
  /**订阅关系 */
  SUBSCRIBER_SUBSCRIBE = 'SUBSCRIBER_SUBSCRIBE',
  /**取消订阅关系 */
  SUBSCRIBER_UNSUBSCRIBE = 'SUBSCRIBER_UNSUBSCRIBE',
  /**更新订阅者状态 */
  SUBSCRIBER_UPDATE = 'SUBSCRIBER_UPDATE',
  /**连接订阅者 */
  SUBSCRIBER_CONNECT = 'SUBSCRIBER_CONNECT',
  /**断开订阅者连接 */
  SUBSCRIBER_DISCONNECT = 'SUBSCRIBER_DISCONNECT',
  /**接收发布者消息 */
  SUBSCRIBER_RECEIVE = 'SUBSCRIBER_RECEIVE'
}

/**发送消息类型 */
export enum SendType {
  PUBLISHER_CLOSE = 'PUBLISHER_CLOSE',
  PUBLISHER_MESSAGE = 'PUBLISHER_MESSAGE',
  SUBSCRIBER_CLOSE = 'SUBSCRIBER_CLOSE'
}
