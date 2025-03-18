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
    loopCommand();
  }
);

// 循环命令
async function loopCommand() {
  const { code } = await inquirer.prompt([
    {
      type: "input",
      name: "code",
      message: `
      全局配置

      0:退出
      1:设置互联中心地址
      2:设置swagger文档读取地址
      3:读取配置
      4:清空配置

      `,
    },
  ]);

  switch (Number(code)) {
    case 0:
      await configCommand.Command?.help();
      return ;
    case 1:
      await setHubCenter();
      break;
    case 2:
      await setApiUrl();
      break;
    case 3:
      console.log(getAllConfig());

      break;
    case 4:
      clearConfig();
      break;
    default:
      console.log("没有这个选项");
      break;
  }
  loopCommand();
}

async function setHubCenter() {
  const { url } = await inquirer.prompt([
    {
      type: "input",
      name: "url",
      message: `请输入互联中心地址`,
    },
  ]);
  config.set("hubCenter", url);
}

async function setApiUrl() {
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

export function getAllConfig() {
  const hubCenter = config.get("hubCenter");
  const apiDocUrl = config.get("apiDocUrl");
  return { hubCenter, apiDocUrl };
}

function clearConfig() {
  config.clear();
  console.log("配置已清空");
}
