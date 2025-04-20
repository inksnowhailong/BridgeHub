import { PaginationParams, PaginationResult } from 'src/domain/dto/Pagination.dto';
import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';
import { SubscriptionEntity } from 'src/domain/entities/subscription.entity';

export interface SubscriberRepository {
  createSubscriber(subscriber: SubscriberEntity): Promise<SubscriberEntity>;
  updateSubscriber(subscriber: SubscriberEntity): Promise<SubscriberEntity>;
  getSubscriberById(id: string): Promise<SubscriberEntity>;
  getSubscriberByDeviceId(
    deviceId: string,
    authData: string
  ): Promise<SubscriberEntity>;
  getListByPage(
    params: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>>;
  deleteSubscriber(deviceId: string): Promise<any>;

  // 订阅关系管理
  createSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
  removeSubscription(subscriberId: string, publisherId: string): Promise<any>;
  getSubscriptionsBySubscriberId(subscriberId: string): Promise<SubscriptionEntity[]>;
  getSubscriptionsByPublisherId(publisherId: string): Promise<SubscriptionEntity[]>;
}
