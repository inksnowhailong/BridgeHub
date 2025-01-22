import { Controller, Get } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get('list')
  async getPublisherList(): Promise<any[]> {
    return this.publisherService.getPublisherList();
  }
}
