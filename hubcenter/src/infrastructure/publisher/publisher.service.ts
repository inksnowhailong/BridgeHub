import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import {
  PublisherCreateParamsDTO,
  PublisherStartDTO,
  PublisherUpdateStatusDTO
} from 'src/domain/dto/publisher.dto';
import { PublisherEntity } from 'src/domain/entities/publisher.entity';
import { PublisherStatus } from 'src/domain/enum/publisher.enum';
import { PublisherRepositoryPgsql } from 'src/usecase/repositories/publisher.repositoryImp';
import { DataSource } from 'typeorm';

/**
 * @description:发布者的业务逻辑
 * @return {*}
 */
@Injectable()
export class PublisherService extends PublisherRepositoryPgsql {
  constructor(
    @Inject('PGSQL_DATA_SOURCE')
    private readonly dataSource: DataSource
  ) {
    super(dataSource.getRepository(PublisherEntity));
  }
  async addPublisher(
    params: PublisherCreateParamsDTO
  ): Promise<PublisherEntity> {
    // console.log('params :>> ', params);
    const publisherE = new PublisherEntity({
      ...params,
      createdAt: Date.now(),
      lastStartedAt: Date.now(),
      status: PublisherStatus.CLOSE
    });
    // try {
    const newPublisher = await this.createPublisher(publisherE);
    // console.log('newPublisher :>> ', newPublisher);
    return newPublisher;
    // } catch (error) {
    //   throw new PayloadType(500, { data: error });
    // }
  }

  async getPublisherList(
    pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>> {
    return await this.getListByPage(pageParams);
  }
  // async getPublisherById(id: string): Promise<PublisherEntity> {
  //   return await this.getPublisherById(id);
  // }
  // async updatePublisher(publiser: PublisherEntity): Promise<PublisherEntity> {
  //   return await this.updatePublisher(publiser);
  // }
  async updatePublisherStatus(
    params: PublisherUpdateStatusDTO
  ): Promise<PublisherEntity> {
    const publisher = await this.getPublisherById(params.id);
    publisher.status = params.status;
    return await this.updatePublisher(publisher);
  }

  /**
   * @description: 启动与某个服务的发布者的链接
   * @param {string} serverName
   * @return {*}
   */
  async startPublisher(server: PublisherStartDTO) {
    const publisher = await this.getPublisherByDeviceId(
      server.deviceId,
      server.authData
    );
    if (publisher) {
      publisher.status = PublisherStatus.ACTIVE;
      publisher.lastStartedAt = Date.now();
      return await this.updatePublisher(publisher);
    }
  }

  /**
   * @description: 停止与某个服务的发布者的链接
   * @param {string} deviceId
   * @param {string} authData
   * @return {*}
   */
  async stopPublisher(deviceId: string, authData: string) {
    const publisher = await this.getPublisherByDeviceId(deviceId, authData);
    if (publisher) {
      publisher.status = PublisherStatus.CLOSE;
      return await this.updatePublisher(publisher);
    }
  }
}
