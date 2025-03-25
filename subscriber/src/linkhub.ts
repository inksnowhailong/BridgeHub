import { commandOption } from "./commandCreater.ts";
import inquirer from "inquirer";
import { getDeviceId, useWait } from "./utils/tools.ts";
import { Websocket } from "./websocket.ts";
import { MessageEnum } from "./messageEnum.ts";
import { ResponseDTO } from "./dtos/response.dto.ts";
import { getAllConfig } from "./config.ts";

export const linkHub = new commandOption(
  "linkhub",
  "链接服务中心",
  "",

  async () => {
    const wsServer = getAllConfig().hubCenter;
    if (!wsServer) {
      console.log("请先设置互联中心地址");
      return;
    }
    // 在这里添加发布逻辑
    const socket = new Websocket(wsServer);

    loopCommand(socket);
  }
);
// 循环命令
async function loopCommand(socket: Websocket) {
  const { code } = await inquirer.prompt([
    {
      type: "input",
      name: "code",
      message: `
      选择你要做的事情

      0:退出
      1:创建订阅者
      `,
    },
  ]);

  switch (Number(code)) {
    case 0:
      await linkHub.Command?.help();
      return;
    case 1:
      await createsubscriber(socket);
      break;
    default:
      console.log("没有这个选项");

      break;
  }
  loopCommand(socket);
}

/**
 * @description: 创建当前机器为一个订阅者
 * @param {Websocket} socket
 * @return {*}
 */
async function createsubscriber(socket: Websocket) {
  const deviceId = await getDeviceId();
  // 创建订阅者
  // 向服务器发送消息
  const { wait, next } = useWait();
  socket.emit(
    "message",
    {
      messageType: MessageEnum.SUBSCRIBER_CREATE,
      data: {
        serverName: "nodetest " + new Date().toLocaleDateString(),
        gitUrl: "https://github.com/inksnowhailong/BridgeHub.git",
        authData: "no",
        deviceId: deviceId,
        serverType: "node",
        customData: "{}",
      },
    },
    (res: ResponseDTO) => {
      console.log(`

        ${res.message}

        `);
      next();
    }
  );
  await wait;
}
