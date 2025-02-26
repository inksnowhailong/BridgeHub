import { commandOption } from "./commandCreater";
import inquirer from "inquirer";
import { io } from "socket.io-client";
import { getDeviceId, useWait } from "./utils/tools";
import { Websocket } from "./websocket";

export const linkHub = new commandOption(
  "linkhub",
  "链接服务中心",
  "",

  async () => {
    // 在这里添加发布逻辑
    const socket = new Websocket();

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

      1:创建发布者
      2:启用发布者
      `,
    },
  ]);

  switch (Number(code)) {
    case 1:
      await createPublisher(socket);
      break;

    default:
      console.log("没有这个选项");

      break;
  }
  loopCommand(socket);
}

async function createPublisher(socket: Websocket) {
  const deviceId = await getDeviceId();
  // 创建发布者
  // 向服务器发送消息
  const { wait, next } = useWait();

  socket.emit(
    "message",
    {
      messageType: "PUBLISHER_CREATE",
      data: {
        serverName: "nodetest " + new Date().toLocaleDateString(),
        gitUrl: "https://github.com/inksnowhailong/BridgeHub.git",
        authData: "no",
        deviceId: deviceId,
        serverType: "node",
        customData: "{}",
      },
    },
    (res: any) => {
      console.log(res);

     next();
    }
  );
  await wait;
}
