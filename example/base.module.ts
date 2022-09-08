import { api } from './api-setting';
import { BaseService } from './base.service';
import { GroupMassage } from './group-massage.entity';
import { BaseController } from './base.controller';
import { Module } from '../package/core/decorator';
import { OrmModule } from './orm.module';
import { Scope } from '../package/core/type/types';
import { TestModule } from './test.module';
import { Test } from './test.entity';

@Module({
  imports: async () => [(await OrmModule.register(api.ormSetting)).importRepository(GroupMassage, Test), TestModule],
  controller: [BaseController],
  provider: [],
  exports: [],
})
export class BaseModule {}
