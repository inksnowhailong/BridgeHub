export interface PublisherEntity {
  /**服务的主键 */
  id: string;
  /**服务的名字 */
  serverName: string;
  /** 身份验证信息 比如可以存为密码，公钥等或者未来可能用其他的方式 */
  authData: string;
  /**设备识别码 */
  deviceId: string;
  /**服务的git */
  gitUrl: string;
  /**服务创建时间 */
  createdAt: number;
  /**上一次启动时间 */
  lastStartedAt: number;
  /**服务的类型 */
  serverType: string;
  /**服务的状态 */
  status: PublisherStatus;
  /**自定义储存的数据 */
  customData: string;
}

/**
 * @description: 发布者的状态
 * @return {*}
 */
export  enum PublisherStatus {
  /**正常 */
  ACTIVE = "active",
  /**禁用 */
  DISABLE = "disable",
  /**关闭 */
  CLOSE = "close",
}

/**
 * @description: 创建发布者的参数
 * @return {*}
 */
export interface PublisherCreateParamsDTO {
  /**服务的名字 */
  serverName: string;
  /**服务的git */
  gitUrl: string;
  /**身份验证信息 */
  authData: string;
  /**设备识别码 */
  deviceId: string;
  /**服务的类型 */
  serverType: string;
  /**自定义储存的数据 */
  customData: string;
}
