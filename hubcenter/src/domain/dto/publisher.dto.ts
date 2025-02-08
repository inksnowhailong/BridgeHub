import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
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
 * @description: 修改发布者的参数
 * @return {*}
 */
export class PublisherUpdateParamsDTO {
  /**服务的主键 */
  @IsNotEmpty()
  id: string;
  /**服务的名字 */
  @Matches(
    /^(https?|git):\/\/(?:[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)(?::\d+)?(?:\/(?:[a-zA-Z0-9-_]+))+(\.git)?$/,
    { message: 'gitUrl 必须是一个合法的GIT地址' }
  )
  @IsNotEmpty()
  serverName: string;
  /**身份验证信息 */
  @IsNotEmpty()
  gitUrl: string;
  /**服务的git */
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
  @IsNotEmpty()
  /**服务的状态 */
  status: PublisherStatus;
}

/**
 * @description: 修改状态
 * @return {*}
 */
export class PublisherUpdateStatusDTO {
  /**服务的主键 */
  @IsNotEmpty()
  id: string;
  /**服务的状态 */
  @IsNotEmpty()
  @IsEnum(PublisherStatus, {
    message: 'status 必须是一个合法的状态'
  })
  status: PublisherStatus.DISABLE | PublisherStatus.CLOSE;
}
