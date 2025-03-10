import { commandOption } from "./commandCreater.ts";
import inquirer from "inquirer";
import { io } from "socket.io-client";
import { getDeviceId, useWait } from "./utils/tools.ts";
import { Websocket } from "./websocket.ts";
import axios from "axios";

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
      3:更新接口信息
      `,
    },
  ]);

  switch (Number(code)) {
    case 1:
      await createPublisher(socket);
      break;
    case 3:
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

/**
 * @description: 发送接口json数据
 * @param {Websocket} socket
 * @return {*}
 */
async function sendAPIJson(socket: Websocket) {
  try {
    const res = await axios.get("http://localhost:211/userService/v2/api-docs");
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
    socket.emit("message", {
      messageType: "PUBLISHER_UPDATE",
      data: {
        basePath,
        paths,
      },
    });
  } catch (error) {
    console.log('error :>> ', error);
  }


}
