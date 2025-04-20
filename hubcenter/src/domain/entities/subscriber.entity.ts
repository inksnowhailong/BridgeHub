import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SubscriberStatus } from '../enum/subscriber.enum';

@Entity('subscriber')
export class SubscriberEntity {
  @PrimaryColumn()
  deviceId: string;

  @Column()
  serverName: string;

  @Column()
  gitUrl: string;

  @Column()
  authData: string;

  @Column()
  serverType: string;

  @Column()
  customData: string;

  @Column()
  createdAt: number;

  @Column()
  lastStartedAt: number;

  @Column()
  status: SubscriberStatus;

  constructor(partial: Partial<SubscriberEntity>) {
    Object.assign(this, partial);
  }
}
