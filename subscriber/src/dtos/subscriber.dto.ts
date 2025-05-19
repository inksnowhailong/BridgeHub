/**
 * @description: 创建订阅者的参数
 * @return {*}
 */
export class SubscriberCreateDTO {
  constructor(
    /**订阅者的名字 */
    public serverName: string,
    /**身份验证信息 */
    public authData: string,
    /**设备识别码 */
    public deviceId: string,
    /**订阅的发布者ID列表 */
    public publisherIds?: string[],
    /**自定义储存的数据 */
    public customData?: string
  ) {}
}

/**
 * @description: 订阅者连接的参数
 * @return {*}
 */
export class SubscriberConnectDTO {
  constructor(
    /**身份验证信息 */
    public authData: string,
    /**设备识别码 */
    public deviceId: string
  ) {}
}
