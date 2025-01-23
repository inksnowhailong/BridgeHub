import { PublisherEntity } from 'src/domain/entities/publisher.entity';
import { PublisherRepository } from 'src/domain/repositories/publisher.repository';
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
    serverName: string
  ): Promise<PublisherEntity[]> {
    return [new PublisherEntity()];
  }

  async getAllPublisher(): Promise<PublisherEntity[]> {
    return [new PublisherEntity()];
  }
}
