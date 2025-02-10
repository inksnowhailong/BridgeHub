import { commandOption } from "./commandCreater";

export const linkHub =  new commandOption(
  'linkHub',
  '链接服务中心',
  '-h,--host <host>',
  (options) => {
    console.log(`发布项目: ${options.h}`);
    // 在这里添加发布逻辑

  }
)
