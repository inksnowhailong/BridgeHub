import { SubscriberEntity } from '../../domain/entities/subscriber.entity';
import { SubscriberRepository } from '../../domain/repositories/subscriber.repository';
import {
  PaginationParams,
  PaginationResult
} from '../../domain/dto/Pagination.dto';
import { Repository, Like } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class SubscriberRepositoryPgsql extends SubscriberRepository {
  constructor(private readonly repository: Repository<SubscriberEntity>) {
    super();
  }

  async createSubscriber(
    subscriber: SubscriberEntity
  ): Promise<SubscriberEntity> {
    return this.repository.save(subscriber);
  }

  async updateSubscriber(
    subscriber: SubscriberEntity
  ): Promise<SubscriberEntity> {
    return this.repository.save(subscriber);
  }

  async getSubscriberById(id: string): Promise<SubscriberEntity> {
    const subscriber = await this.repository.findOne({ where: { id } });
    if (!subscriber) {
      throw new NotFoundException('订阅者不存在');
    }
    return subscriber;
  }

  async getSubscriberByServerName(
    serverName: string,
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    const [list, total] = await this.repository.findAndCount({
      where: { serverName: Like(`%${serverName}%`) },
      skip: (pageParams.currentPage - 1) * pageParams.pageSize,
      take: pageParams.pageSize
    });
    return new PaginationResult(list, total, pageParams);
  }

  async getAllSubscriber(): Promise<SubscriberEntity[]> {
    return this.repository.find();
  }

  async getListByPage(
    pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    const [list, total] = await this.repository.findAndCount({
      skip: (pageParams.currentPage - 1) * pageParams.pageSize,
      take: pageParams.pageSize
    });
    return new PaginationResult(list, total, pageParams);
  }

  async getSubscriberByDeviceId(
    deviceId: string,
    authData: string
  ): Promise<SubscriberEntity> {
    const subscriber = await this.repository.findOne({
      where: { deviceId }
    });
    if (!subscriber) {
      throw new UnauthorizedException('设备认证失败');
    }
    return subscriber;
  }
}
