import { MessageType, SendType } from '../enum/message.enum';
import { PublisherCreateParamsDTO, PublisherStartDTO } from './publisher.dto';
import { ApiJsonDTO } from './SwaggerApi.dto';

/**接收消息*/
export type MessageDTO = MessageBase<MessageType, MessageDataDTO>;
/**发送消息 */
export type SendDTO = MessageBase<SendType, SendDataDTO>;

/**
 * @description: 信息交流的数据传输基础类
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

/**消息数据 处理的接收类型映射*/
export interface MessageDataDTO {
  [MessageType.PUBLISHER_CREATE]: PublisherCreateParamsDTO;
  [MessageType.PUBLISHER_START]: PublisherStartDTO;
  [MessageType.PUBLISHER_API_JSON]: ApiJsonDTO;
}
/**发送消息的数据处理类型映射 */
export interface SendDataDTO {
  [SendType.PUBLISHER_CLOSE]: any;
}

// 定义一个通用的接口来描述回调函数的类型
interface Callback<T> {
  (data: T): void;
}

/**
 * @description: 消息交互类（websocket,iframe,webiew等几乎都适合这个）
 * @return {*}
 */
export abstract class MessagePlatform {
  // 定义一个泛型方法来发送消息
  abstract sendMessageToClient<T extends SendDTO>(
    message: T,
    clientFindKey: string
  ): any;

  // 定义一个通用方法来处理客户端消息，假设我们需要处理各种类型的消息
  abstract handleMessageFromClient<T extends MessageDTO>(
    message: T,
    clientFindKey: string
  ): any;
}
