import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationParams,
  PaginationResult
} from '../../domain/dto/Pagination.dto';
import {
  SubscriberCreateParamsDTO,
  SubscriberConnectDTO,
  SubscriberUpdateStatusDTO
} from '../../domain/dto/subscriber.dto';
import { SubscriberEntity } from '../../domain/entities/subscriber.entity';
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
    super(dataSource.getRepository(SubscriberEntity));
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
    subscriber.lastConnectedAt = Date.now();
    subscriber.status = SubscriberStatus.OPEN;
    return this.updateSubscriber(subscriber);
  }

  /**
   * @description: 停止与订阅者的连接
   * @param {string} deviceId
   * @return {*}
   */
  async disconnectSubscriber(deviceId: string): Promise<SubscriberEntity> {
    const subscriber = await this.getSubscriberByDeviceId(deviceId, '');
    subscriber.status = SubscriberStatus.CLOSE;
    return this.updateSubscriber(subscriber);
  }

  /**
   * @description: 订阅发布者
   * @param {string} publisherId
   * @param {string} deviceId
   * @return {*}
   */
  async subscribePublisher(
    publisherId: string,
    deviceId: string
  ): Promise<SubscriberEntity> {
    const subscriber = await this.getSubscriberByDeviceId(deviceId, '');
    if (!subscriber) {
      throw new Error('未找到当前订阅者');
    }

    const publisherIds = (subscriber.publisherIds || '').split(',');
    if (!publisherIds.includes(publisherId)) {
      publisherIds.push(publisherId);
      subscriber.publisherIds = publisherIds.join(',');
      return this.updateSubscriber(subscriber);
    }
    return subscriber;
  }

  /**
   * @description: 取消订阅发布者
   * @param {string} publisherId
   * @param {string} deviceId
   * @return {*}
   */
  async unsubscribePublisher(
    publisherId: string,
    deviceId: string
  ): Promise<SubscriberEntity> {
    const subscriber = await this.getSubscriberByDeviceId(deviceId, '');
    if (!subscriber) {
      throw new Error('未找到当前订阅者');
    }

    const publisherIds = (subscriber.publisherIds || '').split(',');
    const index = publisherIds.indexOf(publisherId);
    if (index > -1) {
      publisherIds.splice(index, 1);
      subscriber.publisherIds = publisherIds.join(',');
      return this.updateSubscriber(subscriber);
    }
    return subscriber;
  }

  /**
   * @description: 获取当前订阅者
   * @return {*}
   */
  private async getCurrentSubscriber(): Promise<SubscriberEntity | null> {
    // TODO: 实现获取当前订阅者的逻辑
    return null;
  }

  /**
   * @description: 获取订阅者订阅的发布者列表
   * @param {string} id
   * @return {*}
   */
  async getSubscribedPublishers(id: string): Promise<any[]> {
    const subscriber = await this.getSubscriberById(id);
    const publisherIds = JSON.parse(subscriber.publisherIds || '');
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

  async deleteSubscriber(id: string): Promise<void> {
    const subscriber = await this.getSubscriberById(id);
    if (!subscriber) {
      throw new Error('未找到订阅者');
    }
    await this.dataSource.getRepository(SubscriberEntity).delete(id);
  }
}
