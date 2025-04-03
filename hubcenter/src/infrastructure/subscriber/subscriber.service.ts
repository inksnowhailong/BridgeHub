import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import {
  SubscriberCreateParamsDTO,
  SubscriberConnectDTO,
  SubscriberUpdateStatusDTO
} from 'src/domain/dto/subscriber.dto';
import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';
import { SubscriberStatus } from 'src/domain/enum/subscriber.enum';
import { SubscriberRepositoryPgsql } from 'src/usecase/repositories/subscriber.repositoryImp';
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
    const newSubscriber = await this.createSubscriber(subscriberE);
    return newSubscriber;
  }

  async getSubscriberList(
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    return await this.getListByPage(pageParams);
  }

  async updateSubscriberStatus(
    params: SubscriberUpdateStatusDTO
  ): Promise<SubscriberEntity> {
    const subscriber = await this.getSubscriberById(params.id);
    subscriber.status = params.status;
    return await this.updateSubscriber(subscriber);
  }

  /**
   * @description: 启动与订阅者的连接
   * @param {SubscriberConnectDTO} params
   * @return {*}
   */
  async connectSubscriber(params: SubscriberConnectDTO) {
    const subscriber = await this.getSubscriberByDeviceId(
      params.deviceId,
      params.authData
    );
    if (subscriber) {
      subscriber.status = SubscriberStatus.ACTIVE;
      subscriber.lastConnectedAt = Date.now();
      return await this.updateSubscriber(subscriber);
    }
  }

  /**
   * @description: 停止与订阅者的连接
   * @param {string} deviceId
   * @param {string} authData
   * @return {*}
   */
  async disconnectSubscriber(deviceId: string, authData: string) {
    const subscriber = await this.getSubscriberByDeviceId(deviceId, authData);
    if (subscriber) {
      subscriber.status = SubscriberStatus.CLOSE;
      return await this.updateSubscriber(subscriber);
    }
  }
}
