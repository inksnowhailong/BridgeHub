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
import { Injectable, Logger } from '@nestjs/common';
import {
  MessageBase,
  MessageDataDTO,
  MessageDTO,
  MessagePlatform,
  SendDTO
} from 'src/domain/dto/message.dto';
import { SendType, MessageType } from 'src/domain/enum/message.enum';
import { PublisherService } from 'src/infrastructure/publisher/publisher.service';

@Injectable()
@WebSocketGateway(3080, { namespace: 'publisher' })
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
  handleMessageFromClient<T extends MessageDTO>(
    message: T,
    clientFindKey: string
  ): any {
    switch (message.messageType) {
      case MessageType.PUBLISHER_CREATE:
        const data = message.data;
        this.publisherService.startPublisher(
          data as MessageDataDTO[MessageType.PUBLISHER_CREATE]
        );
        this.clientMapByName.set(
          data.serverName,
          this.clientMap.get(clientFindKey)
        );
        break;

      default:
        break;
    }
  }
}
