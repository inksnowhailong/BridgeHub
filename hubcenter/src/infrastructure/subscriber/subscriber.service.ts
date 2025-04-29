import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationParams,
  PaginationResult
} from '../../domain/dto/Pagination.dto';
import {
  SubscriberCreateParamsDTO,
  SubscriberConnectDTO,
  SubscriberUpdateStatusDTO,
  SubscriptionDTO
} from '../../domain/dto/subscriber.dto';
import { SubscriberEntity } from '../../domain/entities/subscriber.entity';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SubscriberStatus } from '../../domain/enum/subscriber.enum';
import { SubscriberRepositoryPgsql } from '../../usecase/repositories/subscriber.repositoryImp';
import { DataSource } from 'typeorm';

/**
 * @description:订阅者的业务逻辑
 * @return {*}
 */
@Injectable()
export class SubscriberService extends SubscriberRepositoryPgsql {
  constructor(
    @Inject('PGSQL_DATA_SOURCE')
    private readonly dataSource: DataSource
  ) {
    super(
      dataSource.getRepository(SubscriberEntity),
      dataSource.getRepository(SubscriptionEntity)
    );
  }

  async addSubscriber(
    params: SubscriberCreateParamsDTO
  ): Promise<SubscriberEntity> {
    const subscriberE = new SubscriberEntity({
      ...params,
      publisherIds: JSON.stringify(params.publisherIds),
      createdAt: Date.now(),
      lastConnectedAt: Date.now(),
      status: SubscriberStatus.CLOSE
    });
    return this.createSubscriber(subscriberE);
  }

  async getSubscriberList(
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    return this.getListByPage(pageParams);
  }

  async updateSubscriberStatus(
    params: SubscriberUpdateStatusDTO
  ): Promise<SubscriberEntity> {
    const subscriber = await this.getSubscriberById(params.id);
    subscriber.status = params.status;
    return this.updateSubscriber(subscriber);
  }

  /**
   * @description: 启动与订阅者的连接
   * @param {SubscriberConnectDTO} params
   * @return {*}
   */
  async connectSubscriber(
    params: SubscriberConnectDTO
  ): Promise<SubscriberEntity> {
    const subscriber = await this.getSubscriberByDeviceId(
      params.deviceId,
      params.authData
    );
    subscriber.status = SubscriberStatus.ACTIVE;
    subscriber.lastConnectedAt = Date.now();
    return this.updateSubscriber(subscriber);
  }

  /**
   * @description: 停止与订阅者的连接
   * @param {string} deviceId
   * @param {string} authData
   * @return {*}
   */
  async disconnectSubscriber(
    deviceId: string,
    authData: string
  ): Promise<SubscriberEntity> {
    const subscriber = await this.getSubscriberByDeviceId(deviceId, authData);
    subscriber.status = SubscriberStatus.CLOSE;
    return this.updateSubscriber(subscriber);
  }

  /**
   * @description: 订阅发布者
   * @param {string} publisherId
   * @return {*}
   */
  async subscribePublisher(publisherId: string): Promise<SubscriberEntity> {
    const subscriber = await this.getCurrentSubscriber();
    if (!subscriber) {
      throw new Error('未找到当前订阅者');
    }

    const publisherIds = JSON.parse(subscriber.publisherIds || '[]');
    if (!publisherIds.includes(publisherId)) {
      publisherIds.push(publisherId);
      subscriber.publisherIds = JSON.stringify(publisherIds);
      return this.updateSubscriber(subscriber);
    }
    return subscriber;
  }

  /**
   * @description: 取消订阅发布者
   * @param {string} publisherId
   * @return {*}
   */
  async unsubscribePublisher(publisherId: string): Promise<SubscriberEntity> {
    const subscriber = await this.getCurrentSubscriber();
    if (!subscriber) {
      throw new Error('未找到当前订阅者');
    }

    const publisherIds = JSON.parse(subscriber.publisherIds || '[]');
    const index = publisherIds.indexOf(publisherId);
    if (index > -1) {
      publisherIds.splice(index, 1);
      subscriber.publisherIds = JSON.stringify(publisherIds);
      return this.updateSubscriber(subscriber);
    }
    return subscriber;
  }

  /**
   * @description: 获取当前订阅者
   * @return {*}
   */
  private async getCurrentSubscriber(): Promise<SubscriberEntity> {
    // 这里需要根据实际情况获取当前订阅者
    // 例如通过设备ID或其他标识
    return null;
  }

  /**
   * @description: 获取订阅者订阅的发布者列表
   * @param {string} id
   * @return {*}
   */
  async getSubscribedPublishers(id: string): Promise<any[]> {
    const subscriber = await this.getSubscriberById(id);
    const publisherIds = JSON.parse(subscriber.publisherIds || '[]');
    return publisherIds;
  }

  /**
   * @description: 获取订阅者详情
   * @param {string} id
   * @return {*}
   */
  async getSubscriberDetail(id: string): Promise<SubscriberEntity> {
    return this.getSubscriberById(id);
  }

  /**
   * @description: 创建订阅关系
   * @param {SubscriptionDTO} subscription
   * @return {*}
   */
  async createSubscription(
    subscription: SubscriptionDTO
  ): Promise<SubscriptionEntity> {
    const subscriber = await this.getSubscriberById(subscription.subscriberId);
    const publisherIds = JSON.parse(subscriber.publisherIds || '[]');
    if (!publisherIds.includes(subscription.publisherId)) {
      publisherIds.push(subscription.publisherId);
      subscriber.publisherIds = JSON.stringify(publisherIds);
      await this.updateSubscriber(subscriber);
    }
    return {
      id: `${subscription.subscriberId}-${subscription.publisherId}`,
      subscriberId: subscription.subscriberId,
      publisherId: subscription.publisherId,
      createdAt: subscription.createdAt
    };
  }

  /**
   * @description: 取消订阅关系
   * @param {string} subscriberId
   * @param {string} publisherId
   * @return {*}
   */
  async cancelSubscription(
    subscriberId: string,
    publisherId: string
  ): Promise<void> {
    await this.unsubscribePublisher(publisherId);
  }
}
