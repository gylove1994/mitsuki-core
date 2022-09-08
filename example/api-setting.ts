import { DataSourceOptions } from 'typeorm';
import { MiraiApiHttpSetting } from 'mirai-ts';

class ApiSetting {
  public apiSetting: MiraiApiHttpSetting;
  public ormSetting: DataSourceOptions;
  constructor(api: MiraiApiHttpSetting, ormSetting: DataSourceOptions) {
    this.apiSetting = api;
    this.ormSetting = ormSetting;
  }
}

export const api = new ApiSetting(
  {
    adapters: ['http', 'ws'],
    enableVerify: false,
    verifyKey: '1145141919',
    debug: true,
    singleMode: true,
    cacheSize: 4096,
    adapterSettings: {
      http: {
        port: 8081,
        host: 'localhost',
        cors: ['*'],
      },
      ws: {
        port: 8080,
        host: 'localhost',
      },
    },
  },
  {
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '123456',
    database: 'postgres',
    entities: ['./*.entity.ts'],
    synchronize: true,
  },
);
