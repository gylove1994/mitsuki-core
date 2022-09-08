import { Repository } from 'typeorm';
import { Controller, Handler, Inject, Module } from '../package/core/decorator';
import { OrmModule } from './orm.module';
import { Test } from './test.entity';

@Controller()
class TestController {
  @Handler('GroupMessage')
  public test(@Inject({ ProviderName: `[ormModule:repository]Test` }) test: any) {
    console.log(test);
  }
}

@Module({
  imports: [OrmModule.importRepository(Test)],
  provider: [],
  controller: [TestController],
  exports: [],
})
export class TestModule {}
