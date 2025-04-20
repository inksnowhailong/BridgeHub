import { Inject, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import {
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';
import { SubscriptionEntity } from 'src/domain/entities/subscription.entity';
import { SubscriberStatus } from 'src/domain/enum/subscriber.enum';
import {
  SubscriberCreateParamsDTO,
  SubscriberStartDTO,
  SubscriptionDTO
} from 'src/domain/dto/subscriber.dto';
import { SubscriberRepositoryPgsql } from 'src/usecase/repositories/subscriber.repositoryImp';
import { PublisherEntity } from 'src/domain/entities/publisher.entity';

/**
 * @description: 订阅者的业务逻辑
 * @return {*}
 */
@Injectable()
export class SubscriberService {
  private subscriberRepository: SubscriberRepositoryPgsql;

  constructor(
    @Inject('SQLITE_DATA_SOURCE')
    private readonly dataSource: DataSource
  ) {
    this.subscriberRepository = new SubscriberRepositoryPgsql(
      dataSource.getRepository(SubscriberEntity),
      dataSource.getRepository(SubscriptionEntity)
    );
  }

  /**
   * 添加订阅者
   */
  async addSubscriber(
    params: SubscriberCreateParamsDTO
  ): Promise<SubscriberEntity> {
    const subscriberE = new SubscriberEntity({
      ...params,
      createdAt: Date.now(),
      lastStartedAt: Date.now(),
      status: SubscriberStatus.CLOSE
    });
    return await this.subscriberRepository.createSubscriber(subscriberE);
  }

  /**
   * 获取订阅者列表
   */
  async getSubscriberList(
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    return await this.subscriberRepository.getListByPage(pageParams);
  }

  /**
   * 获取订阅者详情
   */
  async getSubscriberDetail(deviceId: string): Promise<SubscriberEntity> {
    return await this.subscriberRepository.getSubscriberById(deviceId);
  }

  /**
   * 删除订阅者
   */
  async deleteSubscriber(deviceId: string): Promise<any> {
    return await this.subscriberRepository.deleteSubscriber(deviceId);
  }

  /**
   * 启动订阅者
   */
  async startSubscriber(server: SubscriberStartDTO): Promise<SubscriberEntity> {
    const subscriber = await this.subscriberRepository.getSubscriberByDeviceId(
      server.deviceId,
      server.authData
    );
    if (subscriber) {
      subscriber.status = SubscriberStatus.ACTIVE;
      subscriber.lastStartedAt = Date.now();
      return await this.subscriberRepository.updateSubscriber(subscriber);
    }
  }

  /**
   * 停止订阅者
   */
  async stopSubscriber(
    deviceId: string,
    authData: string
  ): Promise<SubscriberEntity> {
    const subscriber = await this.subscriberRepository.getSubscriberByDeviceId(
      deviceId,
      authData
    );
    if (subscriber) {
      subscriber.status = SubscriberStatus.CLOSE;
      return await this.subscriberRepository.updateSubscriber(subscriber);
    }
  }

  /**
   * 创建订阅关系
   */
  async createSubscription(
    subscription: SubscriptionDTO
  ): Promise<SubscriptionEntity> {
    const subscriptionEntity = new SubscriptionEntity({
      subscriberId: subscription.subscriberId,
      publisherId: subscription.publisherId,
      createdAt: Date.now()
    });
    return await this.subscriberRepository.createSubscription(
      subscriptionEntity
    );
  }

  /**
   * 取消订阅关系
   */
  async cancelSubscription(
    subscriberId: string,
    publisherId: string
  ): Promise<any> {
    return await this.subscriberRepository.removeSubscription(
      subscriberId,
      publisherId
    );
  }

  /**
   * 获取订阅者订阅的发布者列表
   */
  async getSubscribedPublishers(
    subscriberId: string
  ): Promise<PublisherEntity[]> {
    const subscriptions =
      await this.subscriberRepository.getSubscriptionsBySubscriberId(
        subscriberId
      );
    const publisherRepository = this.dataSource.getRepository(PublisherEntity);

    // 获取所有发布者ID
    const publisherIds = subscriptions.map((sub) => sub.publisherId);

    // 如果没有订阅任何发布者，返回空数组
    if (publisherIds.length === 0) {
      return [];
    }

    // 查询所有订阅的发布者
    return await publisherRepository.findBy({
      deviceId: In(publisherIds)
    });
  }
}
