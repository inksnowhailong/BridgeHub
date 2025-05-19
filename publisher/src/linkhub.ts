import { commandOption } from "./commandCreater.ts";
import inquirer from "inquirer";
import { io } from "socket.io-client";
import { getDeviceId, useWait } from "./utils/tools.ts";
import { Websocket } from "./websocket.ts";
import axios from "axios";
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
      1:创建发布者
      2:启用发布者
      3:关闭发布者
      4:更新接口信息
      `,
    },
  ]);
  switch (Number(code)) {
    case 0:
      await linkHub.Command?.help();
      return;
    case 1:
      await createPublisher(socket);
      break;
    case 2:
      await openPublisher(socket);
      break;
    case 3:
      await closePublisher(socket);
      break;
    case 4:
      await sendAPIJson(socket);
      break;

    default:
      console.log("没有这个选项");

      break;
  }
  loopCommand(socket);
}

/**
 * @description: 创建当前机器为一个发布者
 * @param {Websocket} socket
 * @return {*}
 */
async function createPublisher(socket: Websocket) {
  const deviceId = await getDeviceId();
  // 创建发布者
  // 向服务器发送消息
  const { wait, next } = useWait();
  socket.emit(
    "message",
    {
      messageType: MessageEnum.PUBLISHER_CREATE,
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

/**
 * @description: 发送接口json数据
 * @param {Websocket} socket
 * @return {*}
 */
async function sendAPIJson(socket: Websocket) {
  const docUrl = getAllConfig().apiDocUrl;
  if (!docUrl) {
    console.log("请先设置swagger文档读取地址");
    return;
  }
  try {
    const res = await axios.get(docUrl);
    const apiJson = res.data;
    const { paths, basePath, definitions } = apiJson;
    // 处理类型数据  优化性能以后再说
    Object.keys(paths).forEach((method) => {
      const data = paths[method];
      data.parameters?.forEach((param: any) => {
        if (param.schema) {
          try {
            param.schema = definitions[param.schema.$ref.split("/")[2]];
          } catch (error) {
            param.schema = null;
          }
        }
      });
      data.responses?.forEach((response: any) => {
        if (response.schema) {
          try {
            response.schema = definitions[response.schema.$ref.split("/")[2]];
          } catch (error) {
            response.schema = null;
          }
        }
      });
    });
    const deviceId = await getDeviceId()
    console.log(deviceId);

    socket.emit("message", {
      messageType: MessageEnum.PUBLISHER_API_JSON,
      data: {
        basePath,
        paths:JSON.stringify(paths),
        deviceId
      },
    });
    console.log("发送成功");

  } catch (error) {
    console.log("error :>> ", error);
  }
}

/**
 * @description: 打开发布者
 * @param {Websocket} socket
 * @return {*}
 */
async function openPublisher(socket: Websocket) {
  const { DeviceId } = await inquirer.prompt([
    {
      type: "input",
      name: "DeviceId",
      message: ` 请输入发布者设备Id,默认使用本机设备Id`,
    },
  ]);
  // const {authData} = await inquirer.prompt([
  //   {
  //     type: "input",
  //     name: "authData",
  //     message: ` 请输入发布者登录密码或授权key`,
  //   },
  // ]);




  const deviceId =DeviceId|| await getDeviceId();
  console.log('faxi');

  // 向服务器发送消息
  const { wait, next } = useWait();
  socket.emit(
    "message",
    {
      messageType: MessageEnum.PUBLISHER_START,
      data: {
        deviceId,
        authData:'no'
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

/**
 * @description: 关闭发布者
 * @param {Websocket} socket
 * @return {*}
 */
async function closePublisher(socket: Websocket) {
  const { DeviceId } = await inquirer.prompt([
    {
      type: "input",
      name: "DeviceId",
      message: ` 请输入发布者设备Id,默认使用本机设备Id`,
    },
  ]);

  const deviceId = DeviceId || (await getDeviceId());
  console.log("关闭发布者中...");

  // 向服务器发送消息
  const { wait, next } = useWait();
  socket.emit(
    "message",
    {
      messageType: MessageEnum.PUBLISHER_CLOSE,
      data: {
        deviceId,
        authData: "no",
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
