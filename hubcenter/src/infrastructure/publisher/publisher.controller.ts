import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherCreateParamsDTO } from 'src/domain/dto/publisher.dto';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  // @Get('list')
  // async getPublisherList(): Promise<any[]> {
  //   return this.publisherService.getPublisherList();
  // }
  @Post('create')
  async createPublisher(
    @Body() createCatDto: PublisherCreateParamsDTO
  ): Promise<any> {
    return this.publisherService.addPublisher(createCatDto);
  }
}
