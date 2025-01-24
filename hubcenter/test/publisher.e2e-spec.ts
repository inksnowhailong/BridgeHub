import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PublisherModule } from 'src/infrastructure/publisher/publisher.module';

describe('publisher (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PublisherModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('创建发布者', () => {
    return request(app.getHttpServer())
      .post('/publisher/create')
      .send({
        serverName: '测试发布者',
        gitUrl: 'https://github.com/inksnowhailong/BridgeHub.git',
        authData: 'no',
        deviceId: 'iid',
        serverType: 'node',
        customData: '{}'
      }) // Add body data here
      .expect(201);
  });
});
