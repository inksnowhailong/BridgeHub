import { Entity, Column, PrimaryColumn, Unique, Generated } from 'typeorm';
import { PublisherStatus } from '../enum/publisher.enum';

@Entity()
export class PublisherEntity {
  /**服务的主键 */
  @PrimaryColumn({ type: 'uuid', unique: true })
  @Generated('uuid')
  id: string;
  /**服务的名字 */
  @Column({ type: 'varchar', length: 255, unique: true })
  serverName: string;
  /** 身份验证信息 比如可以存为密码，公钥等或者未来可能用其他的方式 */
  @Column({ type: 'varchar' })
  authData: string;
  /**设备识别码 */
  @Column({ type: 'varchar', length: 255, unique: true })
  deviceId: string;
  /**服务的git */
  @Column({ type: 'varchar', length: 255 })
  gitUrl: string;
  /**服务创建时间 */
  @Column({ type: 'bigint' })
  createdAt: number;
  /**上一次启动时间 */
  @Column({ type: 'bigint' })
  lastStartedAt: number;
  /**服务的类型 */
  @Column({ type: 'varchar', length: 255 })
  serverType: string;
  /**服务的状态 */
  @Column({ type: 'varchar', length: 64 })
  status: PublisherStatus;
  /**自定义储存的数据 */
  @Column({ type: 'varchar' })
  customData: string;
  constructor(
    init?: Omit<PublisherEntity, 'id'> & Partial<Pick<PublisherEntity, 'id'>>
  ) {
    Object.assign(
      this,
      {
        serverName: '',
        authData: '',
        deviceId: '',
        gitUrl: '',
        createdAt: 0,
        lastStartedAt: 0,
        serverType: '',
        status: PublisherStatus.CLOSE,
        customData: '{}'
      },
      init
    );
  }
}
