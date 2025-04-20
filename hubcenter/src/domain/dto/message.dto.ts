import { MessageType, SendType } from '../enum/message.enum';
import { PublisherCreateParamsDTO, PublisherStartDTO } from './publisher.dto';
import { SubscriberCreateParamsDTO, SubscriberStartDTO, SubscriptionDTO } from './subscriber.dto';
import { ApiJsonDTO } from './SwaggerApi.dto';

/**接收消息*/
export type MessageDTO = MessageBase<MessageType, MessageDataDTO>;
/**发送消息 */
export type SendDTO = MessageBase<SendType, SendDataDTO>;

/**
 * @description: 基础消息传输对象
 * @return {*}
 */
export class MessageBase<T extends string, D extends Record<T, any>> {
  /**消息类型 */
  messageType: T;
  /**消息内容 */
  data: D[T];

  constructor(messageType: T, data: D[T]) {
    this.messageType = messageType;
    this.data = data;
  }
}

/**消息数据处理的接收类型映射 */
export interface MessageDataDTO {
  [MessageType.PUBLISHER_CREATE]: PublisherCreateParamsDTO;
  [MessageType.PUBLISHER_START]: PublisherStartDTO;
  [MessageType.PUBLISHER_API_JSON]: ApiJsonDTO;
  [MessageType.PUBLISHER_CLOSE]: PublisherStartDTO;
  [MessageType.SUBSCRIBER_CREATE]: SubscriberCreateParamsDTO;
  [MessageType.SUBSCRIBER_START]: SubscriberStartDTO;
  [MessageType.SUBSCRIBER_CLOSE]: SubscriberStartDTO;
  [MessageType.SUBSCRIBER_SUBSCRIBE]: SubscriptionDTO;
  [MessageType.SUBSCRIBER_UNSUBSCRIBE]: SubscriptionDTO;
}

/**发送消息的数据处理类型映射 */
export interface SendDataDTO {
  [SendType.PUBLISHER_CLOSE]: any;
  [SendType.PUBLISHER_MESSAGE]: any;
  [SendType.SUBSCRIBER_CLOSE]: any;
}

/**回调函数接口定义 */
interface Callback<T> {
  (data: T): void;
}

/**
 * @description: 消息交互平台类（适用于websocket、iframe、webview等多种场景）
 * @return {*}
 */
export abstract class MessagePlatform {
  /**
   * 向客户端发送消息
   * @param message 消息内容
   * @param clientFindKey 客户端标识键
   */
  abstract sendMessageToClient<T extends SendDTO>(
    message: T,
    clientFindKey: string
  ): any;

  /**
   * 处理来自客户端的消息
   * @param message 消息内容
   * @param clientFindKey 客户端标识键
   */
  abstract handleMessageFromClient<T extends MessageDTO>(
    message: T,
    clientFindKey: string
  ): any;
}
