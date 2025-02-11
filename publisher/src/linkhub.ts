import { commandOption } from "./commandCreater";
import inquirer from "inquirer";
import { io } from "socket.io-client";

export const linkHub = new commandOption(
  "linkhub",
  "链接服务中心",
  "-h,--host <host>",
  async (options) => {
    console.log(options);

    if (!options.host) {
      const { host } = await inquirer.prompt([
        {
          type: "input",
          name: "host",
          message: "请输入要链接的服务中心:",
        },
      ]);
      options.host = host;
    }
    console.log(`发布项目: ${options.host}`);
    // 在这里添加发布逻辑
    const socket = io("http://localhost:3080/publisher");
    // 连接事件
    socket.on("connect", () => {
      console.log("Connected to the WebSocket server!");
      // 向服务器发送消息
      socket.emit("message", {
        messageType: "PUBLISHER_CREATE",
        data: {
          serverName: "test"
        },
      });
    });
    // 监听服务器发来的消息
    socket.on("message", (message) => {
      console.log("Received message:", message);
    });

    // 断开连接事件
    socket.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server");
    });
  }
);
