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
import { NestException } from 'src/shared/exception/nest.exception';
import {
  TypeormExceptionErrorHandler,
  DefaultErrorHandler
} from 'src/shared/exception/ErrorHandlers';
import { WebSocketFilter } from '../exception/websocket.exception';
import { ResponseDTO } from 'src/domain/dto/response.dto';

const nestException = new NestException();
nestException.LinkErrhandlers([
  new TypeormExceptionErrorHandler(),
  new DefaultErrorHandler()
]);

@Injectable()
@WebSocketGateway(3080, { namespace: 'publisher' })
@UseFilters(new WebSocketFilter(nestException))
export class WsGateway
  extends MessagePlatform
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clientMap = new Map<string, Socket>();
  private clientMapByName = new Map<string, Socket>();
  private logger: Logger = new Logger('WebSocketGateway');
  constructor(private publisherService: PublisherService) {
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
    this.logger.log(`有服务建立了链接: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`有服务关闭了链接: ${client.id}`);
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
      case SendType.PUBLISHER_CLOSE:
        this.sendMessage(clientFindKey, message.data);
        break;

      default:
        break;
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
    // console.log(message.messageType);
    switch (message.messageType) {
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
        const apijson =
          message.data as MessageDataDTO[MessageType.PUBLISHER_API_JSON];
        console.log('apijson :>> ', apijson);
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
      default:
        break;
    }
  }
}
