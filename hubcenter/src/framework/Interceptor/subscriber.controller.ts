import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param
} from '@nestjs/common';
import { SubscriberService } from '../../infrastructure/subscriber/subscriber.service';
import {
  PaginationParams,
  PaginationResult
} from '../../domain/dto/Pagination.dto';
import { ResponseDTO } from '../../domain/dto/response.dto';
import { SubscriberEntity } from '../../domain/entities/subscriber.entity';
import {
  SubscriberCreateParamsDTO,
  SubscriberUpdateStatusDTO,
  SubscriberConnectDTO,
  SubscriptionDTO,
  UnsubscriptionDTO
} from '../../domain/dto/subscriber.dto';

@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  /**
   * 获取订阅者列表
   */
  @Get('list')
  async getSubscriberList(
    @Query() query: PaginationParams
  ): Promise<ResponseDTO<PaginationResult<SubscriberEntity[]>>> {
    const result = await this.subscriberService.getSubscriberList(query);
    return new ResponseDTO(200, '获取成功', result);
  }

  /**
   * 获取订阅者详情
   */
  @Get(':id')
  async getSubscriberDetail(
    @Param('id') id: string
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result = await this.subscriberService.getSubscriberDetail(id);
    return new ResponseDTO(200, '获取成功', result);
  }

  /**
   * 获取订阅者订阅的发布者列表
   */
  @Get(':id/publishers')
  async getSubscribedPublishers(
    @Param('id') id: string
  ): Promise<ResponseDTO<any[]>> {
    const result = await this.subscriberService.getSubscribedPublishers(id);
    return new ResponseDTO(200, '获取成功', result);
  }

  @Post()
  async createSubscriber(
    @Body() params: SubscriberCreateParamsDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result = await this.subscriberService.addSubscriber(params);
    return new ResponseDTO(200, '创建成功', result);
  }

  @Post(':id/status')
  async updateSubscriberStatus(
    @Param('id') id: string,
    @Body() params: SubscriberUpdateStatusDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    params.id = id;
    const result = await this.subscriberService.updateSubscriberStatus(params);
    return new ResponseDTO(200, '更新成功', result);
  }

  @Post('connect')
  async connectSubscriber(
    @Body() params: SubscriberConnectDTO
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result = await this.subscriberService.connectSubscriber(params);
    return new ResponseDTO(200, '连接成功', result);
  }

  @Post('disconnect')
  async disconnectSubscriber(
    @Body('deviceId') deviceId: string
  ): Promise<ResponseDTO<SubscriberEntity>> {
    const result = await this.subscriberService.disconnectSubscriber(deviceId);
    return new ResponseDTO(200, '断开连接成功', result);
  }

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

  @Post('delete/:id')
  async deleteSubscriber(
    @Param('id') id: string
  ): Promise<ResponseDTO<null>> {
    try {
      await this.subscriberService.deleteSubscriber(id);
      return new ResponseDTO(200, '删除成功', null);
    } catch (error) {
      return new ResponseDTO(500, error.message, null);
    }
  }
}
