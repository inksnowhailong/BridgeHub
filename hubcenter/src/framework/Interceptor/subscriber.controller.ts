import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { SubscriberService } from 'src/infrastructure/subscriber/subscriber.service';
import { PaginationParams } from 'src/domain/dto/Pagination.dto';
import { ResponseDTO } from 'src/domain/dto/response.dto';
import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';
import { SubscriptionDTO } from 'src/domain/dto/subscriber.dto';

@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  /**
   * 获取订阅者列表
   */
  @Get('list')
  async getSubscriberList(@Query() query: PaginationParams) {
    const result = await this.subscriberService.getSubscriberList(query);
    return new ResponseDTO(200, '获取成功', result);
  }

  /**
   * 获取订阅者详情
   */
  @Get(':id')
  async getSubscriberDetail(@Param('id') id: string) {
    const result = await this.subscriberService.getSubscriberDetail(id);
    return new ResponseDTO(200, '获取成功', result);
  }

  /**
   * 删除订阅者
   */
  @Delete(':id')
  async deleteSubscriber(@Param('id') id: string) {
    const result = await this.subscriberService.deleteSubscriber(id);
    return new ResponseDTO(200, '删除成功', result);
  }

  /**
   * 获取订阅者订阅的发布者列表
   */
  @Get(':id/publishers')
  async getSubscribedPublishers(@Param('id') id: string) {
    const result = await this.subscriberService.getSubscribedPublishers(id);
    return new ResponseDTO(200, '获取成功', result);
  }

  /**
   * 创建订阅关系
   */
  @Post('subscribe')
  async createSubscription(@Body() subscription: SubscriptionDTO) {
    const result = await this.subscriberService.createSubscription(subscription);
    return new ResponseDTO(200, '订阅成功', result);
  }

  /**
   * 取消订阅关系
   */
  @Delete('unsubscribe')
  async cancelSubscription(@Body() subscription: SubscriptionDTO) {
    const result = await this.subscriberService.cancelSubscription(
      subscription.subscriberId,
      subscription.publisherId
    );
    return new ResponseDTO(200, '取消订阅成功', result);
  }
}
