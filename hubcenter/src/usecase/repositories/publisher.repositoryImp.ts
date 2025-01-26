import { PublisherEntity } from 'src/domain/entities/publisher.entity';
import { PublisherRepository } from 'src/domain/repositories/publisher.repository';
import {
  Pagination,
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination';
import { Repository } from 'typeorm';

export class PublisherRepositoryPgsql extends PublisherRepository {
  constructor(private readonly repository: Repository<PublisherEntity>) {
    super();
  }
  createPublisher(params: PublisherEntity): Promise<PublisherEntity> {
    return this.repository.save(params);
  }

  async updatePublisher(params: PublisherEntity): Promise<PublisherEntity> {
    return new PublisherEntity();
  }

  async getPublisherById(id: string): Promise<PublisherEntity> {
    return new PublisherEntity();
  }

  async getPublisherByServerName(
    serverName: string,
    pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>> {
    throw new Error('Method not implemented.');
  }

  async getAllPublisher(): Promise<PublisherEntity[]> {
    return this.repository.find();
  }
  async getListByPage(
    pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>> {
    const { pageSize, currentPage } = pageParams;

    try {
      const [datas, total] = await this.repository.findAndCount({
        skip: (currentPage - 1) * pageSize,
        take: pageSize
      });
      // 创建分页数据
      const pageData = new Pagination(total, pageSize, currentPage);
      return pageData.createPaginationResult(datas);
    } catch (error) {
      return error;
    }
  }
}
