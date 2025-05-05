import { io } from 'socket.io-client';
import { MessageType, Message, ResponseDTO } from '../types/message';

export class Websocket {
  public socket: any;

  constructor(url: string) {
    this.socket =  io(url, {
      transports: ['websocket'], // 确保支持 polling
      withCredentials: true
    });
  }

  emit(type: MessageType | 'message', data: any, callback?: (res: ResponseDTO) => void) {
    this.socket.emit('message', { type, data }, callback);
  }

  onMessage(callback: (message: Message) => void) {
    this.socket.on('message', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
