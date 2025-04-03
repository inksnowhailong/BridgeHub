import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublisherModule } from '../infrastructure/publisher/publisher.module';
import { SubscriberModule } from '../infrastructure/subscriber/subscriber.module';
import { AuthMiddleware } from 'src/framework/middleware/authMiddleware';
import { PublisherController } from 'src/infrastructure/publisher/publisher.controller';
import { SubscriberController } from 'src/infrastructure/subscriber/subscriber.controller';
import { WsGateway } from './websocket/websocket.gateway';

@Module({
  imports: [PublisherModule, SubscriberModule],
  controllers: [AppController],
  providers: [AppService, WsGateway]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'publisher/create', method: RequestMethod.POST },
        { path: 'subscriber/create', method: RequestMethod.POST }
      )
      .forRoutes(PublisherController, SubscriberController);
  }
}
