import { SubscriberEntity } from '../entities/subscriber.entity';
import { PaginationParams, PaginationResult } from '../dto/Pagination.dto';

export abstract class SubscriberRepository {
  /**
   * @description: 创建订阅者
   * @param {SubscriberEntity} params
   * @return {*}
   */
  abstract createSubscriber(
    params: SubscriberEntity
  ): Promise<SubscriberEntity>;

  /**
   * @description: 更新订阅者
   * @param {SubscriberEntity} params
   * @return {*}
   */
  abstract updateSubscriber(
    params: SubscriberEntity
  ): Promise<SubscriberEntity>;

  /**
   * @description: 根据id获取订阅者
   * @param {string} id
   * @return {*}
   */
  abstract getSubscriberById(id: string): Promise<SubscriberEntity>;

  /**
   * @description: 根据订阅者名模糊查询订阅者
   * @return {*}
   */
  abstract getSubscriberBySubscriberName(
    subscriberName: string,
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>>;

  /**
   * @description: 获取所有订阅者
   * @return {*}
   */
  abstract getAllSubscriber(): Promise<SubscriberEntity[]>;

  /**
   * @description: 分页获取订阅者列表
   * @param {PaginationParams} pageParams
   * @return {*}
   */
  abstract getListByPage(
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>>;

  /**
   * @description: 根据设备ID和认证信息获取订阅者
   * @param {string} deviceId
   * @param {string} authData
   * @return {*}
   */
  abstract getSubscriberByDeviceId(
    deviceId: string,
    authData: string
  ): Promise<SubscriberEntity>;
}
