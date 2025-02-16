import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PublisherController],
  providers: [PublisherService],
  exports: [PublisherService]
})
export class PublisherModule {}
