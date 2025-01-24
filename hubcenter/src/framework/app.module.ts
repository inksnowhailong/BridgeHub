import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublisherModule } from '../infrastructure/publisher/publisher.module';
import { AuthMiddleware } from 'src/usecase/middleware/authMiddleware';
import { PublisherController } from 'src/infrastructure/publisher/publisher.controller';

@Module({
  imports: [PublisherModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PublisherController);
  }
}
