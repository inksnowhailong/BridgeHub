import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import {
  PublisherCreateParamsDTO,
  PublisherUpdateStatusDTO
} from 'src/domain/dto/publisher.dto';
import {
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import { PublisherEntity } from 'src/domain/entities/publisher.entity';

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

  @Get('list')
  async getPublisherList(
    @Query() pageParams: PaginationParams
  ): Promise<PaginationResult<PublisherEntity[]>> {
    // console.log('pageParams :>> ', pageParams);

    return this.publisherService.getPublisherList(pageParams);
  }
  @Post('update')
  async updatePublisher(
    @Body() params: PublisherEntity
  ): Promise<PublisherEntity> {
    return this.publisherService.updatePublisher(params);
  }
  @Post('updateStatus')
  async updatePublisherStatus(
    @Body() params: PublisherUpdateStatusDTO
  ): Promise<PublisherEntity> {
    return this.publisherService.updatePublisherStatus(params);
  }

  @Post('delete')
  async deletePublisher(@Body() params: { id: string }): Promise<void> {
    return this.publisherService.removePublisher(params.id);
  }
}
