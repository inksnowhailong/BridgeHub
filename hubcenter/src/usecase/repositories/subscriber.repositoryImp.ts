import { Repository } from 'typeorm';
import {
  PaginationParams,
  PaginationResult,
  Pagination
} from 'src/domain/dto/Pagination.dto';
import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';
import { SubscriptionEntity } from 'src/domain/entities/subscription.entity';
import { SubscriberRepository } from './subscriber.repository';

export class SubscriberRepositoryPgsql implements SubscriberRepository {
  constructor(
    private readonly subscriberRepository: Repository<SubscriberEntity>,
    private readonly subscriptionRepository: Repository<SubscriptionEntity>
  ) {}

  async createSubscriber(
    subscriber: SubscriberEntity
  ): Promise<SubscriberEntity> {
    return await this.subscriberRepository.save(subscriber);
  }

  async updateSubscriber(
    subscriber: SubscriberEntity
  ): Promise<SubscriberEntity> {
    await this.subscriberRepository.update(
      { deviceId: subscriber.deviceId },
      subscriber
    );
    return subscriber;
  }

  async getSubscriberById(id: string): Promise<SubscriberEntity> {
    return await this.subscriberRepository.findOne({ where: { deviceId: id } });
  }

  async getSubscriberByDeviceId(
    deviceId: string,
    authData: string
  ): Promise<SubscriberEntity> {
    return await this.subscriberRepository.findOne({
      where: { deviceId, authData }
    });
  }

  async getListByPage(
    params: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    const [data, total] = await this.subscriberRepository.findAndCount({
      skip: (params.currentPage - 1) * params.pageSize,
      take: params.pageSize
    });

    const pagination = new Pagination(
      total,
      params.pageSize,
      params.currentPage
    );
    return pagination.createPaginationResult(data);
  }

  async deleteSubscriber(deviceId: string): Promise<any> {
    // 先删除关联的订阅关系
    await this.subscriptionRepository.delete({ subscriberId: deviceId });
    // 再删除订阅者
    return await this.subscriberRepository.delete({ deviceId });
  }

  // 订阅关系相关操作
  async createSubscription(
    subscription: SubscriptionEntity
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository.save(subscription);
  }

  async removeSubscription(
    subscriberId: string,
    publisherId: string
  ): Promise<any> {
    return await this.subscriptionRepository.delete({
      subscriberId,
      publisherId
    });
  }

  async getSubscriptionsBySubscriberId(
    subscriberId: string
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      where: { subscriberId }
    });
  }

  async getSubscriptionsByPublisherId(
    publisherId: string
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      where: { publisherId }
    });
  }
}
