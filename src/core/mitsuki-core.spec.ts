import { test } from '@jest/globals';
import {
  CLASS_TYPE,
  Container,
  Controller,
  createClassDecorator,
  createInstance,
  createMethodDecorator,
  getMetaAndThrow,
  Injectable,
  isConstructor,
  isFunction,
  METHOD_TYPE,
  Mitsuki,
  MitsukiFactory,
  Module,
  MODULES_OPTIONS,
  module_core,
} from './mitsuki-core';
import { ModuleOptions, Provider } from './types';

beforeEach(() => {
  //恢复IoC容器的初始状态
  Container.container = undefined;
});

describe('装饰器的测试', () => {
  test('测试由工厂函数生成的类装饰器工厂函数,是否可以正确添加元信息', () => {
    //测试用例
    const TestDecorator = createClassDecorator('test');
    @TestDecorator()
    class Test {}
    const meta = Reflect.getMetadata(CLASS_TYPE, Test);
    //创建结果
    const res = 'test';
    //测试
    expect(res).toBe(meta);
  });
  test('测试由工厂函数生成的方法装饰器工厂函数,是否可以正确添加元信息', () => {
    //测试用例
    const TestDecorator = createMethodDecorator('test');
    class Test {
      @TestDecorator()
      public hello() {}
    }
    const meta = Reflect.getMetadata(METHOD_TYPE, Test.prototype.hello);
    //创建期望结果
    const res = 'test';
    //测试
    expect(res).toBe(meta);
  });
  test('测试Module装饰器是否可以正确添加元信息', () => {
    //测试用例
    @Injectable()
    class TestInject {
      public hello() {
        return 'hello';
      }
    }
    @Controller()
    class TestController {
      constructor(private readonly testInject: TestInject) {}
    }
    @Injectable()
    class TestInject2 {
      constructor(private readonly testInject: TestInject) {}
      public hello() {
        return this.testInject.hello();
      }
    }
    @Module({
      controllers: [TestController],
      providers: [TestInject, TestInject2],
    })
    class Test {}
    //创建预期结果
    const res: ModuleOptions = {
      providers: [TestInject, TestInject2],
      controllers: [TestController],
    };
    //测试
    const meta = Reflect.getMetadata(MODULES_OPTIONS, Test);
    expect(res).toStrictEqual(meta);
  });
});

describe('依赖实例的递归创建', () => {
  //公共测试用例-------------------------------------
  const testMethodDecorator = createMethodDecorator('test');
  @Injectable()
  class TestInject {
    public hello() {
      return 'hello';
    }
  }
  @Injectable()
  class TestInject2 {
    constructor(private readonly testInject: TestInject) {}
    public hello() {
      return this.testInject.hello();
    }
  }
  @Controller()
  class TestController {
    constructor(private readonly testInject: TestInject) {}
  }
  @Controller()
  class TestController2 {
    constructor(private readonly testInject: TestInject) {}
    @testMethodDecorator()
    public hello() {
      return this.testInject.hello();
    }
  }
  @Module({
    providers: [TestInject],
    controllers: [TestController2],
  })
  class TestModule3 {}
  @Module({
    imports: [],
    controllers: [],
    providers: [TestInject],
    modules: [],
  })
  class TestModule2 {}
  @Module({
    imports: [],
    controllers: [TestController],
    providers: [TestInject2],
    modules: [TestModule2],
  })
  class TestModule {}
  //----------------------------------------------
  test('测试createInstance是否可以实例化依赖并自动注入', () => {
    //创建待测试案例
    const container = new Container();
    createInstance(container, TestInject2);
    //创建期望结果
    const res = new Container().bind('TestInject', {
      type: 'ioc:provider',
      instance: new TestInject(),
    } as Provider<TestInject>);
    res.bind('TestInject2', {
      type: 'ioc:provider',
      instance: new TestInject2(res.get('TestInject').instance),
    } as Provider<TestInject2>);
    //测试
    expect(container).toStrictEqual(res);
  });
  test('测试对依赖项的访问', () => {
    //创建待测试案例
    const container = new Container();
    createInstance(container, TestInject2);
    //测试
    expect(
      (container.get('TestInject2') as Provider<TestInject2>).instance.hello(),
    ).toBe('hello');
  });
  test('测试依赖项不会被重复创建', () => {
    //创建待测试案例
    const container = new Container();
    createInstance(container, TestInject);
    createInstance(container, TestInject2);
    //创建期望结果
    const res = new Container().bind('TestInject', {
      type: 'ioc:provider',
      instance: new TestInject(),
    } as Provider<TestInject>);
    res.bind('TestInject2', {
      type: 'ioc:provider',
      instance: new TestInject2(res.get('TestInject').instance),
    } as Provider<TestInject2>);
    //测试
    expect(res).toStrictEqual(container);
  });
  test('通过模块实现依赖实例的递归创建', () => {
    //创建待测试案例
    const con = new Container();
    module_core(TestModule);
    //创建期望结果
    const res = new Container().bind('TestInject', {
      type: 'ioc:provider',
      instance: new TestInject(),
    } as Provider<TestInject>);
    res.bind('TestInject2', {
      type: 'ioc:provider',
      instance: new TestInject2(res.get('TestInject').instance),
    } as Provider<TestInject2>);
    res.bind('TestController', {
      type: 'ioc:controller',
      instance: new TestController(res.get('TestInject').instance),
    });
    //结果
    expect(res).toStrictEqual(con);
  });
  test('当IoC容器未创建,通过模块实现依赖实例的递归创建时是否会抛出异常', () => {
    //测试
    expect(() => module_core(TestModule)).toThrowError();
  });
  test('测试普通注入', () => {
    //创建测试案例
    const con = new Container();
    @Module({
      imports: [TestInject, TestInject2],
    })
    class Test {}
    module_core(Test);
    //创建期望结果
    const res = new Container().bind('TestInject', {
      type: 'ioc:provider',
      instance: new TestInject(),
    } as Provider<TestInject>);
    res.bind('TestInject2', {
      type: 'ioc:provider',
      instance: new TestInject2(res.get('TestInject').instance),
    } as Provider<TestInject2>);
    //测试
    expect(res).toStrictEqual(con);
  });
  test('测试提取控制器中被方法装饰器装饰的方法', () => {
    //创建待测试案例
    const con = new Container();
    module_core(TestModule3);
    //测试
    expect('hello').toBe(con.get('[method]hello').fn());
  });
});

describe('工具函数的测试', () => {
  test('测试getMetaAndThrow函数是否可以获得元信息', () => {
    //创建待测试案例
    class Test {}
    Reflect.defineMetadata('test', 'test', Test);
    const meta = Reflect.getMetadata('test', Test);
    //创建期望结果
    const res = 'test';
    //测试
    expect(res).toBe(meta);
  });
  test('测试getMetaAndThrow函数是否可以正常抛出异常', () => {
    //创建待测试案例
    class Test {}
    //测试
    expect(() => getMetaAndThrow('test', Test)).toThrowError();
  });
  test('测试isConstructor函数是否可以正常识别构造函数', () => {
    //创建测试案例
    class Test {
      constructor() {}
      public test() {}
    }
    const p = Object.getPrototypeOf(Test);
    //测试
    expect(isConstructor(p['constructor'])).toBeTruthy();
    expect(isConstructor(p['test'])).toBeFalsy();
  });
  test('测试isFunction函数是否可以正常识别构造函数', () => {
    //创建测试案例
    class Test {
      constructor() {}
      public test() {}
    }
    const p = Object.getPrototypeOf(Test);
    //测试
    expect(isFunction(p['constructor'])).toBeTruthy();
    expect(isFunction('A')).toBeFalsy();
  });
});

describe('Mitsuki主类的测试', () => {
  test('Mitsuki实例的创建', () => {
    //测试
    expect(new Mitsuki()).toBeDefined();
  });
  test('Mitsuki工厂创建时IoC容器是否成功创建', () => {
    //创建测试用例
    @Module({})
    class Test {}
    MitsukiFactory(Test);
    //测试
    expect(Container.container).toBeDefined();
  });
  test('测试在传入非基模块时，是否正常抛出异常', () => {
    //创建测试用例
    @Module()
    class Test {}
    //测试
    expect(() => MitsukiFactory(Test)).toThrowError();
  });
});

describe('IoC容器的测试', () => {
  test('容器在生产模式下创建多次是否会抛出异常', () => {
    //创建测试用例
    function toBeTested() {
      new Container(false);
      new Container(false);
    }
    //测试
    expect(() => toBeTested()).toThrowError();
  });
});
