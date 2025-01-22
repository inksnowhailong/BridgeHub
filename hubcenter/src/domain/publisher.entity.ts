import { Entity, Column, PrimaryColumn, Unique } from 'typeorm';
import { PublisherStatus } from './publisher.enum';

@Entity()
@Unique(['id', 'serverName'])
export class Publisher {
  /**服务的主键 */
  @PrimaryColumn()
  id: string;
  /**服务的名字 */
  @Column({ type: 'varchar' })
  serverName: string;
  /**服务的git */
  @Column({ type: 'varchar' })
  /** 启动密码 */
  @Column({ type: 'varchar' })
  password: string;
  gitUrl: string;
  /**服务创建时间 */
  @Column({ type: 'bigint' })
  createdAt: number;
  /**上一次启动时间 */
  @Column({ type: 'bigint' })
  lastStartedAt: number;
  /**服务的类型 */
  @Column({ type: 'varchar' })
  serverType: string;
  /**服务的状态 */
  @Column({ type: 'varchar' })
  status: PublisherStatus;
  /**自定义储存的数据 */
  @Column({ type: 'varchar' })
  customData: string;
}
