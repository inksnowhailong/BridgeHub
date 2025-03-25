import * as si from "systeminformation";
/**
 * @description: 生成机器码
 * @return {*}
 */
export async function getDeviceId() {
  return await Promise.all([si.system(), si.osInfo()]).then((res) => {
    const system = res[0];
    const osInfo = res[1];
    return `${system.serial}-${osInfo.serial}`;
  });
}

/**
 * @description: 用于暂停
 * @return {*}
 */
export const useWait = () => {
  interface Deferred {
    wait: Promise<unknown>;
    next: Function;
  }

  const obj: Deferred = {} as any; // 先声明为 any，稍后赋值

  // 初始化
  obj.wait = new Promise((resolve) => {
    obj.next = resolve;
  });

  return obj;
};
