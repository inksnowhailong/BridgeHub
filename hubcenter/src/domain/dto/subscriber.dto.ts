import { IsEnum, IsNotEmpty, IsArray } from 'class-validator';
import { SubscriberStatus } from '../enum/subscriber.enum';

/**
 * @description: 创建订阅者的参数
 * @return {*}
 */
export class SubscriberCreateParamsDTO {
  /**订阅者的名字 */
  @IsNotEmpty()
  subscriberName: string;

  /**身份验证信息 */
  @IsNotEmpty()
  authData: string;

  /**设备识别码 */
  @IsNotEmpty()
  deviceId: string;

  /**订阅的发布者ID列表 */
  @IsArray()
  publisherIds: string[];

  /**自定义储存的数据 */
  @IsNotEmpty()
  customData: string;
}

/**
 * @description: 修改订阅者的参数
 * @return {*}
 */
export class SubscriberUpdateParamsDTO {
  /**订阅者的主键 */
  @IsNotEmpty()
  id: string;

  /**订阅者的名字 */
  @IsNotEmpty()
  subscriberName: string;

  /**身份验证信息 */
  @IsNotEmpty()
  authData: string;

  /**设备识别码 */
  @IsNotEmpty()
  deviceId: string;

  /**订阅的发布者ID列表 */
  @IsArray()
  publisherIds: string[];

  /**自定义储存的数据 */
  @IsNotEmpty()
  customData: string;

  /**订阅者的状态 */
  @IsNotEmpty()
  status: SubscriberStatus;
}

/**
 * @description: 修改状态
 * @return {*}
 */
export class SubscriberUpdateStatusDTO {
  /**订阅者的主键 */
  @IsNotEmpty()
  id: string;

  /**订阅者的状态 */
  @IsNotEmpty()
  @IsEnum(SubscriberStatus, {
    message: 'status 必须是一个合法的状态'
  })
  status: SubscriberStatus.DISABLE | SubscriberStatus.CLOSE;
}

/**
 * @description: 订阅者连接的参数
 * @return {*}
 */
export class SubscriberConnectDTO {
  /**身份验证信息 */
  @IsNotEmpty()
  authData: string;

  /**设备识别码 */
  @IsNotEmpty()
  deviceId: string;
}
