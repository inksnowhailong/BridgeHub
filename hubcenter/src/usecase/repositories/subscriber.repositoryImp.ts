import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';
import { SubscriberRepository } from 'src/domain/repositories/subscriber.repository';
import {
  PaginationParams,
  PaginationResult,
  Pagination
} from 'src/domain/dto/Pagination.dto';
import { Repository, Like } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class SubscriberRepositoryPgsql extends SubscriberRepository {
  constructor(private readonly repository: Repository<SubscriberEntity>) {
    super();
  }

  createSubscriber(params: SubscriberEntity): Promise<SubscriberEntity> {
    return this.repository.save(params);
  }

  async updateSubscriber(params: SubscriberEntity): Promise<SubscriberEntity> {
    return this.repository.update(params.id, params).then(() => params);
  }

  async getSubscriberById(id: string): Promise<SubscriberEntity> {
    return this.repository.findOne({
      where: {
        id
      }
    });
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
      where: {
        deviceId
      }
    });
    if (!subscriber) throw new NotFoundException('找不到对应订阅者设备ID');

    if (subscriber.authData !== authData)
      throw new UnauthorizedException('身份验证失败');
    return subscriber;
  }
}
