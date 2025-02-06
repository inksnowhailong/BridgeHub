import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import { PublisherCreateParamsDTO } from 'src/domain/dto/publisher.dto';
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
    const publisherE = new PublisherEntity({
      ...params,
      createdAt: Date.now(),
      lastStartedAt: Date.now(),
      status: PublisherStatus.CLOSE
    });
    // try {
    const newPublisher = await this.createPublisher(publisherE);
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
}
