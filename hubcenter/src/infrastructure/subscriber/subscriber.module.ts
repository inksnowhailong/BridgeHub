import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService]
})
export class SubscriberModule {}
