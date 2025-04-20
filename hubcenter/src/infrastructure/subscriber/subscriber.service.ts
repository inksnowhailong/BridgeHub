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
}
