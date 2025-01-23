import { IsNotEmpty, Matches } from 'class-validator';
import { PublisherStatus } from '../enum/publisher.enum';

/**
 * @description: 创建发布者的参数
 * @return {*}
 */
export class PublisherCreateParamsDTO {
  /**服务的名字 */
  @IsNotEmpty()
  serverName: string;
  @Matches(
    /^(https?|git):\/\/(?:[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)(?::\d+)?(?:\/(?:[a-zA-Z0-9-_]+))+(\.git)?$/,
    { message: 'gitUrl 必须是一个合法的GIT地址' }
  )
  /**服务的git */
  @IsNotEmpty()
  gitUrl: string;
  /**身份验证信息 */
  @IsNotEmpty()
  authData: string;
  /**设备识别码 */
  @IsNotEmpty()
  deviceId: string;
  /**服务的类型 */
  @IsNotEmpty()
  serverType: string;
  /**自定义储存的数据 */
  @IsNotEmpty()
  customData: string;
}

/**
 * @description: 创建发布者的参数
 * @return {*}
 */
export class PublisherUpdateParamsDTO {
  /**服务的主键 */
  id: string;
  /**服务的名字 */
  serverName: string;
  /**身份验证信息 */
  gitUrl: string;
  /**服务的git */
  authData: string;
  /**设备识别码 */
  deviceId: string;
  /**服务的类型 */
  serverType: string;
  /**自定义储存的数据 */
  customData: string;
  /**服务的状态 */
  status: PublisherStatus;
}
