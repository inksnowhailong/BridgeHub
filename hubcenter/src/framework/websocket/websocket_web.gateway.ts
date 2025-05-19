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
  MessageDTO,
  MessagePlatform,
  SendDTO
} from 'src/domain/dto/message.dto';
import { PublisherService } from 'src/infrastructure/publisher/publisher.service';
import { SubscriberService } from 'src/infrastructure/subscriber/subscriber.service';
import { NestException } from 'src/shared/exception/nest.exception';
import {
  TypeormExceptionErrorHandler,
  DefaultErrorHandler
} from 'src/shared/exception/ErrorHandlers';
import { WebSocketFilter } from '../exception/websocket.exception';
import { globalMap } from './ClientMap';

const nestException = new NestException();
nestException.LinkErrhandlers([
  new TypeormExceptionErrorHandler(),
  new DefaultErrorHandler()
]);

@Injectable()
@WebSocketGateway(3080, {
  namespace: 'web',
  cors: {
    origin: '*',
    methods: '*',
    credentials: true
  },
  transports: ['websocket', 'polling']
})
@UseFilters(new WebSocketFilter(nestException))
export class WsGatewayWeb
  extends MessagePlatform
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clientMap = globalMap;
  private clientMapByName = new Map<string, Socket>();
  private logger: Logger = new Logger('WebSocketGateway');

  constructor(
    private publisherService: PublisherService,
    private subscriberService: SubscriberService
  ) {
    super();
  }
  /**
   * @description:  初始化完成后触发
   * @param {Server} server
   * @return {*}
   */
  afterInit(server: Server) {
    this.logger.log('Init WsGatewayWeb');
  }

  /**
   * @description:  客户端连接时触发
   * @param {Socket} client
   * @param {array} args
   * @return {*}
   */
  handleConnection(client: Socket, ...args: any[]) {
    this.clientMap.set(`web-${Date.now()}`, client);
    this.logger.log(`WEB设备 建立了链接: ${client.id}`);
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
    this.clientMap.set(client.id, client);
    const res = await this.handleMessageFromClient(data, client.id);
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
   * @param {string} clientFindKey
   * @return {*}
   */
  sendMessageToClient<T extends SendDTO>(message: T, clientFindKey: string) {
    switch (message.messageType) {
    }
  }

  /**
   * 发送发布者消息到订阅者
   */
  async sendPublisherMessageToSubscribers<T extends SendDTO>(
    message: T,
    publisherId: string
  ) {
    // 获取所有订阅该发布者的订阅者
    const subscriptions =
      await this.subscriberService[
        'subscriberRepository'
      ].getSubscriptionsByPublisherId(publisherId);

    // 向每个订阅者发送消息
    for (const subscription of subscriptions) {
      const subscriberClient = this.clientMap.get(subscription.subscriberId);
      if (subscriberClient) {
        subscriberClient.emit('message', {
          messageType: 'PUBLISHER_MESSAGE',
          data: {
            publisherId,
            content: message.data
          }
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
    switch (message.messageType) {
    }
  }
}
