import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SubscriberStatus } from '../enum/subscriber.enum';

@Entity()
export class SubscriberEntity {
  /**订阅者的主键 */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**订阅者的名字 */
  @Column({ type: 'varchar', length: 255, unique: true })
  subscriberName: string;

  /**身份验证信息 */
  @Column({ type: 'varchar' })
  authData: string;

  /**设备识别码 */
  @Column({ type: 'varchar', length: 255, unique: true })
  deviceId: string;

  /**订阅的发布者ID列表 */
  @Column({ type: 'varchar' })
  publisherIds: string;

  /**订阅者创建时间 */
  @Column({ type: 'bigint' })
  createdAt: number;

  /**上一次连接时间 */
  @Column({ type: 'bigint' })
  lastConnectedAt: number;

  /**订阅者的状态 */
  @Column({ type: 'varchar', length: 64 })
  status: SubscriberStatus;

  /**自定义储存的数据 */
  @Column({ type: 'varchar' })
  customData: string;

  constructor(
    init?: Omit<SubscriberEntity, 'id'> & Partial<Pick<SubscriberEntity, 'id'>>
  ) {
    Object.assign(
      this,
      {
        subscriberName: '',
        authData: '',
        deviceId: '',
        publisherIds: '[]',
        createdAt: 0,
        lastConnectedAt: 0,
        status: SubscriberStatus.CLOSE,
        customData: '{}'
      },
      init
    );
  }
}
