import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UseFilters } from '@nestjs/common';
import {
  MessageDataDTO,
  MessageDTO,
  MessagePlatform,
  SendDTO
} from 'src/domain/dto/message.dto';
import { SendType, MessageType } from 'src/domain/enum/message.enum';
import { PublisherService } from 'src/infrastructure/publisher/publisher.service';
import { SubscriberService } from 'src/infrastructure/subscriber/subscriber.service';
import { NestException } from 'src/shared/exception/nest.exception';
import {
  TypeormExceptionErrorHandler,
  DefaultErrorHandler
} from 'src/shared/exception/ErrorHandlers';
import { WebSocketFilter } from '../exception/websocket.exception';
import { ResponseDTO } from 'src/domain/dto/response.dto';
import { PaginationParams } from 'src/domain/dto/Pagination.dto';
import { globalMap } from './ClientMap';

const nestException = new NestException();
nestException.LinkErrhandlers([
  new TypeormExceptionErrorHandler(),
  new DefaultErrorHandler()
]);

@Injectable()
@WebSocketGateway(3080, { namespace: 'nodeCli' })
@UseFilters(new WebSocketFilter(nestException))
export class WsGateway
  extends MessagePlatform
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clientMap = globalMap;
  private clientMapByName = new Map<string, Socket>();
  private logger: Logger = new Logger('WebSocketGateway');

  constructor(
    private readonly publisherService: PublisherService,
    private readonly subscriberService: SubscriberService
  ) {
    super();
  }
  /**
   * @description:  初始化完成后触发
   * @param {Server} server
   * @return {*}
   */
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  /**
   * @description:  客户端连接时触发
   * @param {Socket} client
   * @param {array} args
   * @return {*}
   */
  handleConnection(client: Socket, ...args: any[]) {
    const deviceId = client.handshake.query.deviceId as string;
    if (deviceId) {
      this.clientMap.set(deviceId, client);
      this.logger.log(`设备 ${deviceId} 建立了链接: ${client.id}`);
    } else {
      this.logger.warn(`未知设备建立了链接: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const deviceId = client.handshake.query.deviceId as string;
    if (deviceId) {
      this.clientMap.delete(deviceId);
      this.logger.log(`设备 ${deviceId} 关闭了链接: ${client.id}`);
    } else {
      this.logger.warn(`未知设备关闭了链接: ${client.id}`);
    }
  }
  /**
   * @description: 接收消息
   * @return {*}
   */
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: MessageDTO,
    @ConnectedSocket() client: Socket
  ): Promise<any> {
    const id = client.id;
    // 遍历所有客户端连接
    for (const [key, webClient] of this.clientMap.entries()) {
      // 检查是否是web客户端
      if (key.startsWith('web-')) {
        // 发送消息到web客户端
        webClient.emit('message', data);
      }
    }
    const res = await this.handleMessageFromClient(data, id);

    return res;
  }
  /**向特定客户端发送消息 */
  sendMessage(clientId: string, message: SendDTO): void {
    const client = this.clientMap.get(clientId);

    if (client) {
      setTimeout(() => {
        client.emit('message', message);
      }, 2000);
    }
  }

  /**
   * @description: 发送消息到客户端
   * @param {T} message
   * @param {string} targetKey
   * @return {*}
   */
  sendMessageToClient<T extends SendDTO>(message: T, targetKey: string) {
    switch (message.messageType) {
      case SendType.PUBLISHER_CLOSE:
      case SendType.SUBSCRIBER_CLOSE:
        this.sendMessage(targetKey, message.data);
        break;
      case SendType.PUBLISHER_MESSAGE:
        // 发送发布者的消息到订阅该发布者的所有订阅者
        this.sendPublisherMessageToSubscribers(message, targetKey);
        break;
      default:
        break;
    }
  }

  /**
   * 发送发布者消息到订阅者
   */
  async sendPublisherMessageToSubscribers<T extends SendDTO>(
    message: T,
    publisherDeviceId: string
  ) {
    // 获取所有订阅该发布者的订阅者
    const page = new PaginationParams();
    page.pageSize = 999;
    const subscriptions = await this.subscriberService.getSubscriberList(page);
    for (const subscription of subscriptions.data) {
      const PublisherEntity =
        await this.publisherService.getPublisherByDeviceId(
          publisherDeviceId,
          ''
        );
      const publisherId = PublisherEntity.id;
      if (!subscription.publisherIds.includes(publisherId)) {
        return;
      }
      console.log(this.clientMap);

      const subscriberClient = this.clientMap.get(subscription.deviceId);

      if (subscriberClient) {
        subscriberClient.emit('message', {
          messageType: MessageType.PUBLISHER_API_JSON,
          data: message.data
        });
      }
    }
  }

  /**
   * @description: 接到客户端消息
   * @return {*}
   */
  async handleMessageFromClient<T extends MessageDTO>(
    message: T,
    clientFindKey: string
  ) {
    console.log(message.messageType);

    switch (message.messageType) {
      // 发布者相关消息
      case MessageType.PUBLISHER_CREATE:
        const publisherData =
          message.data as MessageDataDTO[MessageType.PUBLISHER_CREATE];
        const res = await this.publisherService.addPublisher(publisherData);
        this.clientMapByName.set(
          publisherData.serverName,
          this.clientMap.get(clientFindKey)
        );
        return new ResponseDTO(200, '创建成功', res);
      case MessageType.PUBLISHER_API_JSON:
        const apijson: SendDTO = {
          messageType: SendType.PUBLISHER_MESSAGE,
          data: message.data as MessageDataDTO[MessageType.PUBLISHER_API_JSON]
        };

        this.sendMessageToClient(apijson, message.data.deviceId);
        break;
      case MessageType.PUBLISHER_START:
        const publisherDeviceId =
          message.data as MessageDataDTO[MessageType.PUBLISHER_START];
        const startRes =
          await this.publisherService.startPublisher(publisherDeviceId);
        return new ResponseDTO(200, '启动成功', startRes);
      case MessageType.PUBLISHER_CLOSE:
        const stopData =
          message.data as MessageDataDTO[MessageType.PUBLISHER_CLOSE];
        const stopRes = await this.publisherService.stopPublisher(
          stopData.deviceId,
          stopData.authData
        );
        return new ResponseDTO(200, '关闭成功', stopRes);

      // 订阅者相关消息
      case MessageType.SUBSCRIBER_CREATE:
        const subscriberData =
          message.data as MessageDataDTO[MessageType.SUBSCRIBER_CREATE];
        const subRes =
          await this.subscriberService.addSubscriber(subscriberData);
        return new ResponseDTO(200, '创建订阅者成功', subRes);
      case MessageType.SUBSCRIBER_START:
        const subscriberDeviceId =
          message.data as MessageDataDTO[MessageType.SUBSCRIBER_START];
        const subStartRes = await this.subscriberService.connectSubscriber({
          deviceId: subscriberDeviceId.deviceId,
          authData: subscriberDeviceId.authData
        });
        return new ResponseDTO(200, '启动订阅者成功', subStartRes);
      case MessageType.SUBSCRIBER_CLOSE:
        const subStopData =
          message.data as MessageDataDTO[MessageType.SUBSCRIBER_CLOSE];
        const subStopRes = await this.subscriberService.disconnectSubscriber(
          subStopData.deviceId
        );
        return new ResponseDTO(200, '关闭订阅者成功', subStopRes);

      // 订阅关系相关消息
      case MessageType.SUBSCRIBER_SUBSCRIBE:
        const subscriptionData =
          message.data as MessageDataDTO[MessageType.SUBSCRIBER_SUBSCRIBE];
        const subScribeRes = await this.subscriberService.subscribePublisher(
          subscriptionData.publisherId,
          subscriptionData.deviceId
        );
        return new ResponseDTO(200, '订阅成功', subScribeRes);

      case MessageType.SUBSCRIBER_UNSUBSCRIBE:
        const unsubscriptionData =
          message.data as MessageDataDTO[MessageType.SUBSCRIBER_UNSUBSCRIBE];
        const unsubRes = await this.subscriberService.unsubscribePublisher(
          unsubscriptionData.publisherId,
          clientFindKey
        );
        return new ResponseDTO(200, '取消订阅成功', unsubRes);

      case MessageType.PUBLISHER_LIST:
        const publishers = await this.publisherService.getPublisherList({
          pageSize: 100,
          currentPage: 1
        });
        return new ResponseDTO(200, '获取发布者列表成功', publishers.data);
      default:
        return new ResponseDTO(400, '未知的消息类型', null);
    }
  }

  @SubscribeMessage('subscriber:stop')
  async handleSubscriberStop(
    @MessageBody() subStopData: { deviceId: string }
  ): Promise<void> {
    await this.subscriberService.disconnectSubscriber(subStopData.deviceId);
  }
}
