import { commandOption } from "./commandCreater.ts";
import inquirer from "inquirer";
import { getDeviceId, useWait } from "./utils/tools.ts";
import { Websocket } from "./websocket.ts";
import { MessageType } from './messageEnum';
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
      已开启监听。。。

      0:退出
      1:创建订阅者
      2:订阅指定发布者
      3:删除发布者订阅
      4:查看所有发布者
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
    case 2:
      await subscribePublisher(socket);
      break;
    case 3:
      await unsubscribePublisher(socket);
      break;
    case 4:
      await listPublishers(socket);
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
  const { wait, next } = useWait();
  const message = {
    type: MessageType.SUBSCRIBER_CREATE,
    data: {
      serverName: "nodetest " + new Date().toLocaleDateString(),
      gitUrl: "https://github.com/inksnowhailong/BridgeHub.git",
      authData: "no",
      deviceId: deviceId,
      serverType: "node",
      customData: "{}",
    },
  };
  socket.emit(
    "message",
    message,
    (res: ResponseDTO) => {
      console.log(`\n${res.message}\n`);
      next();
    }
  );
  await wait;
}

/**
 * @description: 订阅指定发布者
 * @param {Websocket} socket
 * @return {*}
 */
async function subscribePublisher(socket: Websocket) {
  const { publisherId } = await inquirer.prompt([
    {
      type: "input",
      name: "publisherId",
      message: "请输入要订阅的发布者ID:",
    },
  ]);

  const { wait, next } = useWait();
  const message = {
    type: MessageType.SUBSCRIBER_SUBSCRIBE,
    data: {
      publisherId,
    },
  };
  socket.emit(
    "message",
    message,
    (res: ResponseDTO) => {
      console.log(`\n${res.message}\n`);
      next();
    }
  );
  await wait;
}

/**
 * @description: 删除发布者订阅
 * @param {Websocket} socket
 * @return {*}
 */
async function unsubscribePublisher(socket: Websocket) {
  const { publisherId } = await inquirer.prompt([
    {
      type: "input",
      name: "publisherId",
      message: "请输入要取消订阅的发布者ID:",
    },
  ]);

  const { wait, next } = useWait();
  const message = {
    type: MessageType.SUBSCRIBER_UNSUBSCRIBE,
    data: {
      publisherId,
    },
  };
  socket.emit(
    "message",
    message,
    (res: ResponseDTO) => {
      console.log(`\n${res.message}\n`);
      next();
    }
  );
  await wait;
}

/**
 * @description: 查看所有发布者
 * @param {Websocket} socket
 * @return {*}
 */
async function listPublishers(socket: Websocket) {
  const { wait, next } = useWait();
  const message = {
    type: MessageType.PUBLISHER_LIST,
    data: {},
  };
  socket.emit(
    "message",
    message,
    (res: ResponseDTO) => {
      if (res.data) {
        console.log("\n发布者列表:");
        res.data.forEach((publisher: any) => {
          console.log(`
ID: ${publisher.id}
名称: ${publisher.serverName}
状态: ${publisher.status}
创建时间: ${new Date(Number(publisher.createdAt)).toLocaleString()}
最后启动时间: ${new Date(Number(publisher.lastStartedAt)).toLocaleString()}
          `);
        });
      }
      next();
    }
  );
  await wait;
}
