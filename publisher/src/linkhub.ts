import { commandOption } from "./commandCreater";
import inquirer from "inquirer";
import { io } from "socket.io-client";
import { getDeviceId } from "./utils/tools";
import { Websocket } from "./websocket";

export const linkHub = new commandOption(
  "linkhub",
  "链接服务中心",
  ["-h,--host <host>", "链接服务中心"],

  async (options) => {
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
    // 在这里添加发布逻辑
    const socket = new Websocket();
    const deviceId = await getDeviceId();

    // 向服务器发送消息
    socket.emit("message", {
      messageType: "PUBLISHER_CREATE",
      data: {
        serverName: "nodetest " + new Date().toLocaleDateString(),
        gitUrl: "https://github.com/inksnowhailong/BridgeHub.git",
        authData: "no",
        deviceId: deviceId,
        serverType: "node",
        customData: "{}",
      },
    });
  }
);
