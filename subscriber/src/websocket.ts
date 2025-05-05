import { io } from "socket.io-client";
import { MessageType } from './messageEnum';
import { handleSwaggerDoc } from './handlers/swagger.handler';

export class Websocket {
  private socket: any;
  private messageHandlers: Map<string, Function> = new Map();

  constructor(url: string = "http://localhost:3080/nodeCli") {
    this.socket = io(url);
    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    // 设置消息监听
    this.socket.on("message", (message: any) => {
      this.handleMessage(message);
    });

    // 注册消息处理器
    this.registerHandler(MessageType.PUBLISHER_API_JSON, handleSwaggerDoc);
  }

  private registerHandler(type: string, handler: Function) {
    this.messageHandlers.set(type, handler);
  }

  private handleMessage(message: any) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data);
    } else {
      console.log('收到未知消息类型:', message.type);
    }
  }

  emit(event: string, data: any, callback?: Function) {
    this.socket.emit(event, data, callback);
  }
}
