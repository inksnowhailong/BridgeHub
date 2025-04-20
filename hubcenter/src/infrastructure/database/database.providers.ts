import { DataSource } from 'typeorm';

export const databaseProviders = [
  /**每次还要启动，很麻烦，先用sqlite了 */
  // {
  //   provide: 'PGSQL_DATA_SOURCE',
  //   useFactory: async () => {
  //     const dataSource = new DataSource({
  //       type: 'postgres',
  //       host: 'localhost',
  //       port: 5433,
  //       username: 'root',
  //       password: 'hubcenter',
  //       database: 'bridgehub_db',
  //       entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  //       synchronize: true
  //     });
  //     return dataSource.initialize();
  //   }
  // },
  {
    provide: 'SQLITE_DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: 'hubcenter.db',
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true
      });
      return dataSource.initialize();
    }
  }
];
