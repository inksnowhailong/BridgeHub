import { commandOption } from "./commandCreater.ts";
import inquirer from "inquirer";
import Configstore from "configstore";

const config = new Configstore("hub-subscriber-cli");

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
      2:读取配置
      3:清空配置

      `,
    },
  ]);

  switch (Number(code)) {
    case 0:
      await configCommand.Command?.help();
      return;
    case 1:
      await setHubCenter();
      break;
    case 2:
      console.log(getAllConfig());

      break;
    case 3:
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

export function getAllConfig() {
  const hubCenter = config.get("hubCenter");
  return { hubCenter};
}

function clearConfig() {
  config.clear();
  console.log("配置已清空");
}
