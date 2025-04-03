import { Module } from '@nestjs/common';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService]
})
export class SubscriberModule {}
