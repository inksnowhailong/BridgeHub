import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import {
  SubscriberCreateParamsDTO,
  SubscriberUpdateStatusDTO,
  SubscriberConnectDTO,
  SubscriptionDTO,
  UnsubscriptionDTO
} from 'src/domain/dto/subscriber.dto';
import {
  PaginationParams,
  PaginationResult
} from 'src/domain/dto/Pagination.dto';
import { SubscriberEntity } from 'src/domain/entities/subscriber.entity';
import { ResponseDTO } from 'src/domain/dto/response.dto';

@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Post('create')
  async createSubscriber(
    @Body() createSubscriberDto: SubscriberCreateParamsDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result =
      await this.subscriberService.addSubscriber(createSubscriberDto);
    return new ResponseDTO(200, '创建成功', result);
  }

  @Get('list')
  async getSubscriberList(
    @Query() pageParams: PaginationParams
  ): Promise<ResponseDTO<PaginationResult<SubscriberEntity[]>>> {
    const result = await this.subscriberService.getSubscriberList(pageParams);
    return new ResponseDTO(200, '获取成功', result);
  }

  @Post('update')
  async updateSubscriber(
    @Body() params: SubscriberEntity
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result = await this.subscriberService.updateSubscriber(params);
    return new ResponseDTO(200, '更新成功', result);
  }

  @Post('updateStatus')
  async updateSubscriberStatus(
    @Body() params: SubscriberUpdateStatusDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result = await this.subscriberService.updateSubscriberStatus(params);
    return new ResponseDTO(200, '状态更新成功', result);
  }

  @Post('connect')
  async connectSubscriber(
    @Body() params: SubscriberConnectDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result = await this.subscriberService.connectSubscriber(params);
    return new ResponseDTO(200, '连接成功', result);
  }

  // @Post('disconnect')
  // async disconnectSubscriber(
  //   @Body() params: SubscriberConnectDTO
  // ): Promise<ResponseDTO<SubscriberEntity>> {
  //   const result = await this.subscriberService.disconnectSubscriber(
  //     params.deviceId,
  //     params.authData
  //   );
  //   return new ResponseDTO(200, '断开连接成功', result);
  // }

  @Post('subscribe')
  async subscribePublisher(
    @Body() subscription: SubscriptionDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    try {
      const result = await this.subscriberService.subscribePublisher(
        subscription.publisherId,
        subscription.deviceId
      );
      return new ResponseDTO(200, '订阅成功', result);
    } catch (error) {
      return new ResponseDTO(500, error.message, null);
    }
  }

  @Post('unsubscribe')
  async unsubscribePublisher(
    @Body() unsubscription: UnsubscriptionDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    try {
      const result = await this.subscriberService.unsubscribePublisher(
        unsubscription.publisherId,
        unsubscription.deviceId
      );
      return new ResponseDTO(200, '取消订阅成功', result);
    } catch (error) {
      return new ResponseDTO(500, error.message, null);
    }
  }

  @Get(':id/publishers')
  async getSubscribedPublishers(
    @Param('id') id: string
  ): Promise<ResponseDTO<any[]>> {
    const result = await this.subscriberService.getSubscribedPublishers(id);
    return new ResponseDTO(200, '获取成功', result);
  }

  @Post('delete/:id')
  async deleteSubscriber(@Param('id') id: string): Promise<ResponseDTO<null>> {
    try {
      await this.subscriberService.deleteSubscriber(id);
      return new ResponseDTO(200, '删除成功', null);
    } catch (error) {
      return new ResponseDTO(500, error.message, null);
    }
  }
}
