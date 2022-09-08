import { Scope, ScopeContent } from './../core/type/types';
import { Logger } from './../common/logger.adapter';
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from './api-setting';
import { Container } from './../core/container';
import { CONTAINER, Controller, Inject, Injectable } from './../core/decorator';
import { Module } from '../core/decorator';
import Mirai from 'mirai-ts';
import { Provider } from '../core/type/types';

describe('容器测试', () => {
  beforeEach(() => {
    Logger.getLogger('test').info('测试开始');
  });
  afterEach(() => {
    Container.global.clear();
    Container.ContainerArray = [];
    Logger.getLogger('test').info('测试完毕');
  });
  test('测试容器的创建', () => {
    @Module({})
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    expect(new Container('Test')).toStrictEqual(meta);
  });
  test('测试依赖的直接类注入', async () => {
    @Injectable()
    class Provider {}
    @Module({
      provider: [Provider],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const shouldBe = new Container('Test').setToInstanceMap('Provider', new Provider());
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的完整注入', async () => {
    @Injectable()
    class Provider {}
    @Module({
      provider: [
        {
          provider: 'Provider',
          useClass: Provider,
        },
      ],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const shouldBe = new Container('Test').setToInstanceMap('Provider', new Provider());
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的工厂注入', async () => {
    //todo 修改provider的类型，使 ·async () => [Provider_1]· 成立
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const promise = new Promise((ro) => {
      setTimeout(() => {
        ro({
          provider: 'Provider_1',
          useClass: Provider_1,
        } as Provider);
      }, 200);
    }) as Promise<Provider>;
    @Injectable()
    class Provider_1 {}
    @Module({
      provider: async () => [await promise],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const shouldBe = new Container('Test').setToInstanceMap('Provider_1', new Provider_1());
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的值注入', async () => {
    @Injectable()
    class Provider {}
    @Module({
      provider: [
        {
          provider: 'Provider',
          useValue: new Provider(),
        },
      ],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const shouldBe = new Container('Test').setToInstanceMap('Provider', new Provider());
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的工厂注入', async () => {
    @Injectable()
    class Provider {}
    @Module({
      provider: [
        {
          provider: 'Provider',
          useFactory: () => new Provider(),
        },
      ],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const shouldBe = new Container('Test').setToInstanceMap('Provider', new Provider());
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的多种方式混合注入', async () => {
    @Injectable()
    class Provider_1 {}
    @Injectable()
    class Provider_2 {}
    @Injectable()
    class Provider_3 {}
    @Injectable()
    class Provider_4 {}
    @Module({
      provider: async () => [
        {
          provider: 'Provider_1',
          useClass: Provider_1,
        },
        Provider_2,
        {
          provider: 'Provider_3',
          useValue: new Provider_3(),
        },
        {
          provider: 'Provider_4',
          useFactory: () => new Provider_4(),
        },
      ],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const shouldBe = new Container('Test')
      .setToInstanceMap('Provider_1', new Provider_1())
      .setToInstanceMap('Provider_2', new Provider_2())
      .setToInstanceMap('Provider_3', new Provider_3())
      .setToInstanceMap('Provider_4', new Provider_4());
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的顺序创建', async () => {
    @Injectable()
    class Provider_1 {
      constructor() {}
    }
    @Injectable()
    class Provider_2 {
      constructor(p: Provider_1) {}
    }
    @Module({
      provider: [Provider_1, Provider_2],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const p = new Provider_1();
    const shouldBe = new Container('Test')
      .setToInstanceMap('Provider_1', p)
      .setToInstanceMap('Provider_2', new Provider_2(p));
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的异步创建', async () => {
    @Injectable()
    class Provider_1 {
      constructor() {}
    }
    @Injectable()
    class Provider_2 {
      constructor(p: Provider_1) {}
    }
    @Module({
      provider: [Provider_2, Provider_1],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await Container.buildModule(Test, new Mirai(api.apiSetting));
    const p = new Provider_1();
    const shouldBe = new Container('Test')
      .setToInstanceMap('Provider_1', p)
      .setToInstanceMap('Provider_2', new Provider_2(p));
    expect(shouldBe).toStrictEqual(meta);
  });
  test('测试依赖的创建时超时报错', async () => {
    @Injectable()
    class Provider_1 {
      constructor() {}
    }
    @Injectable()
    class Provider_2 {
      constructor(p: Provider_1) {}
    }
    @Module({
      provider: [Provider_2],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await expect(async () => {
      await Container.buildModule(Test, new Mirai(api.apiSetting));
    }).rejects.toEqual('获得所需实例：Provider_1 的回调超时，请检查是否存在该实例');
  });
  test('直接传入不含Injectable装饰器的类时抛出异常', async () => {
    class Provider_1 {
      constructor() {}
    }
    @Module({
      provider: [Provider_1],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await expect(async () => {
      await Container.buildModule(Test, new Mirai(api.apiSetting));
    }).rejects.toThrowError();
  });
  test('在用完整Provider类型实例化时没有使用任何use时报错', async () => {
    @Injectable()
    class Provider_1 {
      constructor() {}
    }
    @Module({
      provider: [
        {
          provider: 'Provider_1',
        },
      ],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await expect(async () => {
      await Container.buildModule(Test, new Mirai(api.apiSetting));
    }).rejects.toThrowError();
  });
  test('重复注入时抛出异常', async () => {
    @Module({
      provider: [
        {
          provider: 'Provider_1',
          useValue: '1',
        },
        {
          provider: 'Provider_1',
          useValue: '2',
        },
      ],
    })
    class Test {}
    const meta = Reflect.getMetadata(CONTAINER, Test);
    await expect(async () => {
      await Container.buildModule(Test, new Mirai(api.apiSetting));
    }).rejects.toThrowError();
  });
  test('provider参数注入', async () => {
    @Injectable()
    class Provider_2 {}
    @Injectable()
    class Provider_1 {
      constructor(private readonly provider_2: Provider_2) {}
    }
    @Controller()
    class Controller_1 {
      constructor(private readonly provider_2: Provider_2) {}
    }
    @Module({
      provider: [Provider_2, Provider_1],
      controller: [Controller_1],
    })
    class Test {}
    const d = new Provider_2();
    expect((await Container.buildModule(Test, new Mirai(api.apiSetting)))[0]).toStrictEqual(
      new Container('Test')
        .setToInstanceMap('Provider_1', new Provider_1(d))
        .setToInstanceMap('Provider_2', d)
        .setToInstanceMap('Controller_1', new Controller_1(d)),
    );
  });
  test('获取全局注入实例', async () => {
    @Injectable()
    class Provider_2 {}
    @Injectable()
    class Provider_1 {
      constructor(private readonly provider_2: Provider_2) {}
    }
    @Controller()
    class Controller_1 {
      constructor(private readonly provider_2: Provider_2) {}
    }
    @Module({
      provider: [Provider_1],
      controller: [Controller_1],
    })
    class Test {}
    Container.setToGlobalInstanceMap('Provider_2', new Provider_2());
    const d = new Provider_2();
    expect((await Container.buildModule(Test, new Mirai(api.apiSetting)))[0]).toStrictEqual(
      new Container('Test')
        .setToInstanceMap('Provider_1', new Provider_1(d))
        .setToInstanceMap('Controller_1', new Controller_1(d)),
    );
  });
  test('scope设置', async () => {
    @Injectable()
    class Provider_2 {}
    @Injectable({ scope: Scope.DEFAULT })
    class Provider_1 {
      constructor(private readonly provider_2: Provider_2) {}
    }
    @Controller()
    class Controller_1 {
      constructor(private readonly provider_2: Provider_2) {}
    }
    @Module({
      provider: [
        {
          provider: 'Provider_2',
          useClass: Provider_2,
          scope: Scope.TRANSIENT,
        },
        Provider_1,
      ],
      controller: [Controller_1],
    })
    class Test {}
    const d = new Provider_2();
    expect((await Container.buildModule(Test, new Mirai(api.apiSetting)))[0]).toStrictEqual(
      new Container('Test')
        .setToInstanceMap('Provider_1', new Provider_1(d))
        .setToInstanceMap('Provider_2', {
          container: Container.ContainerArray.pop(),
          provider: 'Provider_2',
          scope: Scope.TRANSIENT,
          useClass: Provider_2,
        } as ScopeContent)
        .setToInstanceMap('Controller_1', new Controller_1(d)),
    );
  });
});
