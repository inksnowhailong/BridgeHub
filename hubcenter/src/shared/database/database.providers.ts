import { DataSource } from 'typeorm';
import * as path from 'path';

export const databaseProviders = [
  {
    provide: 'DataSource',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: 'hubcenter',
        entities: [path.resolve(__dirname, '../../**/*.entity{.ts,.js}')],
        synchronize: true
      });
      return dataSource.initialize();
    }
  }
];
