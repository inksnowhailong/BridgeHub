import { io, Socket } from 'socket.io-client';
import { MessageType } from './messageEnum';
import { handleSwaggerDoc } from './handlers/swagger.handler';
import { getDeviceId } from './utils/tools';

export class Websocket {
  private socket!: Socket;
  private deviceId!: string;
  private messageHandlers: Map<string, Function> = new Map();

  constructor(url: string) {
    this.init(url);
  }

  private async init(url: string) {
    this.deviceId = await getDeviceId();
    console.log(  this.deviceId );

    this.socket = io(url, {
      query: {
        deviceId: this.deviceId
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('message', (message: any) => {
      this.handleMessage(message);
    });

    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    // 注册消息处理器
    this.registerHandler(MessageType.PUBLISHER_API_JSON, handleSwaggerDoc);
  }

  private registerHandler(type: string, handler: Function) {
    this.messageHandlers.set(type, handler);
  }

  private handleMessage(message: any) {
    const handler = this.messageHandlers.get(message.messageType);
    if (handler) {
      handler(message.data);
    } else {
      console.log('收到未知消息类型:', message.messageType);
    }
  }

  public sendMessage(message: any) {
    if (this.socket.connected) {
      this.socket.emit('message', message);
    } else {
      console.error('Socket is not connected');
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public emit(event: string, data: any, callback?: Function) {
    if (this.socket.connected) {
      this.socket.emit(event, data, callback);
    } else {
      console.error('Socket is not connected');
    }
  }

  /**
   * @description: 订阅发布者
   */
  public subscribePublisher(publisherId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emit('message', {
        messageType: MessageType.SUBSCRIBER_SUBSCRIBE,
        data: { publisherId }
      }, (response: any) => {
        if (response.code === 200) {
          resolve(response.data);
        } else {
          reject(new Error(response.message));
        }
      });
    });
  }

  /**
   * @description: 取消订阅发布者
   */
  public unsubscribePublisher(publisherId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emit('message', {
        messageType: MessageType.SUBSCRIBER_UNSUBSCRIBE,
        data: { publisherId }
      }, (response: any) => {
        if (response.code === 200) {
          resolve(response.data);
        } else {
          reject(new Error(response.message));
        }
      });
    });
  }
}
