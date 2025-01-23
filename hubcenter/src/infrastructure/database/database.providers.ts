import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'PGSQL_DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'root',
        password: 'hubcenter',
        database: 'bridgehub_db',
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true
      });
      return dataSource.initialize();
    }
  }
];
