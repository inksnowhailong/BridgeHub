import { io, Socket } from "socket.io-client";

export class Websocket {
  socket: Socket;
  socketAwait: Promise<Socket>;
  constructor(wsServer: string = "http://localhost:3080/nodeCli") {
    this.socket = io(wsServer);
    this.socketAwait = new Promise((resolve) => {
      this.socket.on("connect", () => {
        resolve(this.socket);
      });
    });
    this.socket.on("message", (message) => {
        // console.log("Received message:", message);
      });
      // 断开连接事件
      this.socket.on("disconnect", () => {
        console.log("Disconnected from the WebSocket server");
      });
  }

  async emit(event: string, ...args: any[]) {
    await this.socketAwait;
    this.socket.emit(event, ...args);
  }
}
