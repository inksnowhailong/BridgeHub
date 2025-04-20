/**
 * @description: 创建订阅者的参数
 * @return {*}
 */
export class SubscriberCreateDTO {
  /**订阅者的名字 */
  subscriberName: string;
  /**身份验证信息 */
  authData: string;
  /**设备识别码 */
  deviceId: string;
  /**订阅的发布者ID列表 */
  publisherIds?: string[];
  /**自定义储存的数据 */
  customData?: string;
}

/**
 * @description: 订阅者连接的参数
 * @return {*}
 */
export class SubscriberConnectDTO {
  /**身份验证信息 */
  authData: string;
  /**设备识别码 */
  deviceId: string;
}
