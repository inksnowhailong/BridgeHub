import { commandOption } from "./commandCreater.ts";
import inquirer from "inquirer";
import Configstore from "configstore";

const config = new Configstore("hub-publisher-cli");

export const configCommand = new commandOption(
  "config",
  "配置",
  "",

  async () => {
    // 在这里添加发布逻辑
    loopCommand(config);
  }
);

// 循环命令
async function loopCommand(config: Configstore) {
  const { code } = await inquirer.prompt([
    {
      type: "input",
      name: "code",
      message: `
      全局配置

      1:设置互联中心地址
      2:设置swagger文档读取地址
      3:读取配置
      4:清空配置
      `,
    },
  ]);

  switch (Number(code)) {
    case 1:
      await setHubCenter(config);
      break;
    case 2:
      await setApiUrl(config);
      break;
    case 3:
      getAllConfig(config);
      break;
    case 4:
      clearConfig(config);
      break;
    default:
      console.log("没有这个选项");
      break;
  }
  loopCommand(config);
}

async function setHubCenter(config: Configstore) {
  const { url } = await inquirer.prompt([
    {
      type: "input",
      name: "url",
      message: `请输入互联中心地址`,
    },
  ]);
  config.set("hubCenter", url);
}

async function setApiUrl(config: Configstore) {
  const { url } = await inquirer.prompt([
    {
      type: "input",
      name: "url",
      message: `请输入swagger文档的json数据地址.
          示例：http://localhost:3000/v2/api-docs`,
    },
  ]);
  config.set("apiDocUrl", url);
}

function getAllConfig(config: Configstore) {
  const hubCenter = config.get("hubCenter");
  const apiDocUrl = config.get("apiDocUrl");
  console.log({ hubCenter, apiDocUrl });
}

function clearConfig(config: Configstore) {
  config.clear();
  console.log("配置已清空");
}
