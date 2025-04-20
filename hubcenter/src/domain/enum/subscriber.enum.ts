/**
 * @description: 订阅者的状态
 * @return {*}
 */
export enum SubscriberStatus {
  /**正常 */
  ACTIVE = 'active',
  /**禁用 */
  DISABLE = 'disable',
  /**关闭 */
  CLOSE = 'close',
  /**连接中 */
  CONNECTING = 'connecting',
  /**断开连接 */
  DISCONNECTED = 'disconnected'
}
