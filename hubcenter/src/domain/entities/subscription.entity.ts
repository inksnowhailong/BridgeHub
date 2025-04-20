import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscription')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subscriberId: string;

  @Column()
  publisherId: string;

  @Column()
  createdAt: number;

  constructor(partial: Partial<SubscriptionEntity>) {
    Object.assign(this, partial);
  }
}
