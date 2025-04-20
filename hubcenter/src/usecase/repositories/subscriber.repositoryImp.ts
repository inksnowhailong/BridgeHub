import { SubscriberEntity } from '../../domain/entities/subscriber.entity';
import { SubscriberRepository } from '../../domain/repositories/subscriber.repository';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import {
  PaginationParams,
  PaginationResult,
  Pagination
} from '../../domain/dto/Pagination.dto';
import { Repository, Like } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class SubscriberRepositoryPgsql extends SubscriberRepository {
  constructor(
    private readonly repository: Repository<SubscriberEntity>,
    private readonly subscriptionRepository: Repository<SubscriptionEntity>
  ) {
    super();
  }

  async createSubscriber(params: SubscriberEntity): Promise<SubscriberEntity> {
    return this.repository.save(params);
  }

  async updateSubscriber(params: SubscriberEntity): Promise<SubscriberEntity> {
    const result = await this.repository.update(params.id, params);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscriber with ID ${params.id} not found`);
    }
    return params;
  }

  async getSubscriberById(id: string): Promise<SubscriberEntity> {
    const subscriber = await this.repository.findOne({
      where: { id }
    });
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
    return subscriber;
  }

  async getSubscriberBySubscriberName(
    subscriberName: string,
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    const { currentPage = 1, pageSize = 10 } = pageParams;
    const [data, total] = await this.repository.findAndCount({
      where: {
        subscriberName: Like(`%${subscriberName}%`)
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    });

    const pagination = new Pagination(total, pageSize, currentPage);
    return {
      data,
      Pagination: pagination
    };
  }

  async getAllSubscriber(): Promise<SubscriberEntity[]> {
    return this.repository.find();
  }

  async getListByPage(
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    const { currentPage = 1, pageSize = 10 } = pageParams;
    const [data, total] = await this.repository.findAndCount({
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    });

    const pagination = new Pagination(total, pageSize, currentPage);
    return {
      data,
      Pagination: pagination
    };
  }

  async getSubscriberByDeviceId(
    deviceId: string,
    authData: string
  ): Promise<SubscriberEntity> {
    const subscriber = await this.repository.findOne({
      where: { deviceId, authData }
    });
    if (!subscriber) {
      throw new UnauthorizedException('Invalid device ID or auth data');
    }
    return subscriber;
  }

  async deleteSubscriber(deviceId: string): Promise<void> {
    await this.subscriptionRepository.delete({ subscriberId: deviceId });
    await this.repository.delete({ deviceId });
  }

  async createSubscription(
    subscription: SubscriptionEntity
  ): Promise<SubscriptionEntity> {
    return this.subscriptionRepository.save(subscription);
  }

  async removeSubscription(
    subscriberId: string,
    publisherId: string
  ): Promise<void> {
    await this.subscriptionRepository.delete({
      subscriberId,
      publisherId
    });
  }

  async getSubscriptionsBySubscriberId(
    subscriberId: string
  ): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepository.find({
      where: { subscriberId }
    });
  }

  async getSubscriptionsByPublisherId(
    publisherId: string
  ): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepository.find({
      where: { publisherId }
    });
  }
}
