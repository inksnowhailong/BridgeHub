import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import {
  SubscriberCreateParamsDTO,
  SubscriberUpdateStatusDTO
} from 'src/domain/dto/subscriber.dto';
import {
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';

@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Post('create')
  async createSubscriber(
    @Body() createSubscriberDto: SubscriberCreateParamsDTO
  ): Promise<SubscriberEntity> {
    return this.subscriberService.addSubscriber(createSubscriberDto);
  }

  @Get('list')
  async getSubscriberList(
    @Query() pageParams: PaginationParams
  ): Promise<PaginationResult<SubscriberEntity[]>> {
    return this.subscriberService.getSubscriberList(pageParams);
  }

  @Post('update')
  async updateSubscriber(
    @Body() params: SubscriberEntity
  ): Promise<SubscriberEntity> {
    return this.subscriberService.updateSubscriber(params);
  }

  @Post('updateStatus')
  async updateSubscriberStatus(
    @Body() params: SubscriberUpdateStatusDTO
  ): Promise<SubscriberEntity> {
    return this.subscriberService.updateSubscriberStatus(params);
  }
}
