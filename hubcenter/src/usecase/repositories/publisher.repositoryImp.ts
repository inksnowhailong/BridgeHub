import { PublisherEntity } from 'src/domain/entities/publisher.entity';
import { PublisherRepository } from 'src/domain/repositories/publisher.repository';
import {
  Pagination,
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import { Repository, Like } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class PublisherRepositoryPgsql extends PublisherRepository {
  constructor(private readonly repository: Repository<PublisherEntity>) {
    super();
  }
  createPublisher(params: PublisherEntity): Promise<PublisherEntity> {
    // console.log('params :>> ', params);

    return this.repository.save(params);
  }

  async updatePublisher(params: PublisherEntity): Promise<PublisherEntity> {
    return this.repository.update(params.id, params).then(() => params);
  }

  async getPublisherById(id: string): Promise<PublisherEntity> {
    return this.repository.findOne({
      where: {
        id
      }
    });
  }
  async getPublisherByServerName(
    serverName: string,
    pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>> {
    const { pageSize, currentPage } = pageParams;

    const [datas, total] = await this.repository.findAndCount({
      where: {
        serverName: Like(`%${serverName}%`)
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    });
    // 创建分页数据
    const pageData = new Pagination(total, pageSize, currentPage);
    return pageData.createPaginationResult(datas);
  }

  async getAllPublisher(): Promise<PublisherEntity[]> {
    return this.repository.find();
  }
  async getListByPage(
    pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>> {
    const { pageSize, currentPage } = pageParams;

    const [datas, total] = await this.repository.findAndCount({
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    });
    // 创建分页数据
    const pageData = new Pagination(total, pageSize, currentPage);
    return pageData.createPaginationResult(datas);
  }
  async getPublisherByDeviceId(
    deviceId: string,
    authData: string
  ): Promise<PublisherEntity> {
    const publisher = await this.repository.findOne({
      where: {
        deviceId
      }
    });
    if (!publisher) throw new NotFoundException('找不到对应发布者设备ID');

    // if (publisher.authData !== authData)
    //   throw new UnauthorizedException('身份验证失败');
    return publisher;
  }

  async deletePublisher(publisher: PublisherEntity): Promise<void> {
    await this.repository.remove(publisher);
  }
}
