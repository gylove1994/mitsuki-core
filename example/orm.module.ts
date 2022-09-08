import { LoggerLike } from './../package/common/logger.adapter';
import { Logger } from './../package/common/logger.adapter';
import { EventEmitter } from 'events';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { Module } from '../package/core/decorator';
import { Constructor, DynamicModule, Provider, Scope } from '../package/core/type/types';
import { mitsukiLoggerFactory } from '../package/common/logger.factory';

@Module()
export class OrmModule {
  private static eventEmitter: EventEmitter = new EventEmitter();
  private static logger: LoggerLike = Logger.getLogger('OrmModule');
  private static isRegister: boolean;
  private static dataSource: DataSource;
  public static async register(options: DataSourceOptions): Promise<typeof OrmModule> {
    if (this.isRegister && this.isRegister == true) {
      this.logger.error(`重复注册，OrmModule仅可被注册一次`);
    }
    this.dataSource = await new DataSource(options).initialize();
    this.isRegister = true;
    Object.freeze(OrmModule);
    this.eventEmitter.emit('DataSource', this.dataSource);
    return OrmModule;
  }
  private static async getDataSource(): Promise<DataSource> {
    return new Promise((ro, rj) => {
      if (this.dataSource) {
        ro(this.dataSource);
      } else {
        this.eventEmitter.on('dataSource', (val) => {
          ro(val);
        });
      }
      setTimeout(() => rj(`超时未获取到DataSource，请检查OrmModule.register是否被调用。`), 3000);
    });
  }
  public static importRepository(...entity: Constructor[]): DynamicModule {
    return {
      name: this.name,
      imports: [],
      provider: async () =>
        entity.map((val) => {
          return {
            provider: '[ormModule:repository]' + val.name,
            useFactory: async () => (await this.getDataSource()).getRepository(val),
          };
        }) as Provider[],
      exports: async () => entity.map((val) => '[ormModule:repository]' + val.name),
    };
  }
}
