import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublisherModule } from './infrastructure/publisher/publisher.module';

@Module({
  imports: [PublisherModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
