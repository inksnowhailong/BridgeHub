import { Command } from 'commander';
import { commandOption } from '../commandCreater';
import { SubscriberCreateDTO } from '../dtos/subscriber.dto';
import { ResponseDTO } from '../dtos/response.dto';
import { websocket } from '../websocket';
import { MessageType } from '../messageEnum';
import { config } from '../config';
import * as readline from 'readline';
import * as crypto from 'crypto';

/**
 * @description: 创建订阅者命令
 * @return {*}
 */
export class SubscriberCommand {
  /**
   * @description: 创建订阅者命令
   * @return {*}
   */
  static createCommand(): commandOption {
    return new commandOption(
      'create',
      '创建订阅者',
      [
        '-n, --name <name>',
        '订阅者名称',
        ''
      ],
      async function(this: Command) {
        const name = this.opts().name;
        if (!name) {
          console.error('订阅者名称不能为空');
          return;
        }

        // 生成设备ID和认证信息
        const deviceId = crypto.randomUUID();
        const authData = crypto.randomBytes(16).toString('hex');

        // 创建订阅者
        const subscriber: SubscriberCreateDTO = {
          subscriberName: name,
          deviceId,
          authData,
          publisherIds: [],
          customData: '{}'
        };

        // 询问是否要订阅发布者
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question('是否要订阅发布者？(y/n): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            rl.question('请输入发布者ID（多个ID用逗号分隔）: ', async (publisherIds) => {
              if (publisherIds) {
                subscriber.publisherIds = publisherIds.split(',').map(id => id.trim());
              }
              await createSubscriber(subscriber);
              rl.close();
            });
          } else {
            await createSubscriber(subscriber);
            rl.close();
          }
        });
      }
    );
  }

  /**
   * @description: 连接订阅者命令
   * @return {*}
   */
  static connectCommand(): commandOption {
    return new commandOption(
      'connect',
      '连接订阅者',
      [
        '-d, --deviceId <deviceId>',
        '设备ID',
        ''
      ],
      [
        '-a, --authData <authData>',
        '认证信息',
        ''
      ],
      async function(this: Command) {
        const deviceId = this.opts().deviceId;
        const authData = this.opts().authData;

        if (!deviceId || !authData) {
          console.error('设备ID和认证信息不能为空');
          return;
        }

        await connectSubscriber(deviceId, authData);
      }
    );
  }
}

/**
 * @description: 创建订阅者
 * @param {SubscriberCreateDTO} subscriber
 * @return {*}
 */
async function createSubscriber(subscriber: SubscriberCreateDTO) {
  try {
    const response = await websocket.sendMessage<ResponseDTO>({
      type: MessageType.SUBSCRIBER_CREATE,
      data: subscriber
    });

    if (response.code === 200) {
      console.log('订阅者创建成功');
      console.log('设备ID:', subscriber.deviceId);
      console.log('认证信息:', subscriber.authData);
      console.log('请妥善保管以上信息，用于后续连接');
    } else {
      console.error('订阅者创建失败:', response.message);
    }
  } catch (error) {
    console.error('订阅者创建失败:', error);
  }
}

/**
 * @description: 连接订阅者
 * @param {string} deviceId
 * @param {string} authData
 * @return {*}
 */
async function connectSubscriber(deviceId: string, authData: string) {
  try {
    const response = await websocket.sendMessage<ResponseDTO>({
      type: MessageType.SUBSCRIBER_CONNECT,
      data: {
        deviceId,
        authData
      }
    });

    if (response.code === 200) {
      console.log('订阅者连接成功');
    } else {
      console.error('订阅者连接失败:', response.message);
    }
  } catch (error) {
    console.error('订阅者连接失败:', error);
  }
}
