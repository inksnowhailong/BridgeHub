import * as si from "systeminformation";
/**
 * @description: 生成机器码
 * @return {*}
 */
export async function getDeviceId() {
  Promise.all([si.system(), si.osInfo()]).then((res) => {
    const system = res[0];
    const osInfo = res[1];
    return `${system.serial}-${osInfo.serial}`;
  });
}
