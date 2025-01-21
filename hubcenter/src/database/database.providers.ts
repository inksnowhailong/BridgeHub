import { DataSource } from 'typeorm';

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
        database: 'bridgehub_db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true
      });
      return dataSource.initialize();
    }
  }
];
