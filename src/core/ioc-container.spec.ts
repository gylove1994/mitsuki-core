import Log4js from 'log4js';
import Mirai from "mirai-ts";
import { Controller, createMethodDecorator, Injectable, Module } from "./decorators";
import { Container, createInstance, module_core } from "./ioc-container";
import { MitsukiFactory } from "./mitsuki-core";
import { Provider } from "./types";
import 'reflect-metadata';

beforeEach(() => {
  const logger = Log4js.getLogger('test'); 
  logger.level = 'debug';
  //恢复IoC容器的初始状态
  Container.container = undefined; 
  logger.info('单元测试开始');
});

afterEach(()=>{
  const logger = Log4js.getLogger('test');
  logger.info('单元测试结束');
})

describe('IoC容器的测试', () => {
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
  @Controller()
  class TestController3{
    constructor(private readonly mirai: Mirai){}
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
  @Module({
    controllers:[TestController3]
  })
  class TestModule4 {}
  //----------------------------------------------
  test('测试createInstance是否可以实例化依赖并自动注入', () => {
    //创建待测试案例
    const container = new Container();
    createInstance(container, TestInject2);
    //创建期望结果
    const res = new Container().bind(TestInject, {
      type: 'ioc:provider',
      instance: new TestInject(),
    },'[class]');
    res.bind(TestInject2, {
      type: 'ioc:provider',
      instance: new TestInject2(res.get<Provider<TestInject>>(TestInject,'[class]')!.instance),
    },'[class]');
    //测试
    expect(container).toStrictEqual(res);
  });
  test('测试对依赖项的访问', () => {
    //创建待测试案例
    const container = new Container();
    createInstance(container, TestInject2);
    //测试
    expect(
      (container.get(TestInject2,'[class]') as Provider<TestInject2>).instance.hello(),
    ).toBe('hello');
  });
  test('测试依赖项不会被重复创建', () => {
    //创建待测试案例
    const container = new Container();
    createInstance(container, TestInject);
    createInstance(container, TestInject2);
    //创建期望结果
    const res = new Container().bind(TestInject, {
      type: 'ioc:provider',
      instance: new TestInject(),
    },'[class]');
    res.bind(TestInject2, {
      type: 'ioc:provider',
      instance: new TestInject2(res.get(TestInject,'[class]').instance),
    },'[class]');
    //测试
    expect(res).toStrictEqual(container);
  });
  test('通过模块实现依赖实例的递归创建', () => {
    //创建待测试案例
    const con = new Container();
    module_core(TestModule);
    //创建期望结果
    const res = new Container().bind(TestInject, {
      type: 'ioc:provider',
      instance: new TestInject(),
    },'[class]');
    res.bind(TestInject2, {
      type: 'ioc:provider',
      instance: new TestInject2(res.get(TestInject,'[class]').instance),
    },'[class]');
    res.bind(TestController, {
      type: 'ioc:controller',
      instance: new TestController(res.get(TestInject,'[class]').instance),
    },'[class]');
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
    const res = new Container().bind(TestInject, {
      type: 'ioc:provider',
      instance: new TestInject(),
    },'[class]');
    res.bind(TestInject2, {
      type: 'ioc:provider',
      instance: new TestInject2(res.get(TestInject,'[class]').instance),
    },'[class]');
    //测试
    expect(res).toStrictEqual(con);
  });
  test('测试提取控制器中被方法装饰器装饰的方法', () => {
    //创建待测试案例
    const con = new Container();
    module_core(TestModule3);
    //测试
    expect('hello').toBe(con.get(TestController2.prototype.hello,'[method]').instance());
  });
  test('测试对于方法参数的实例对象已在IoC容器中时，不会重复创建',()=>{
    expect(() =>MitsukiFactory(TestModule4)).not.toThrowError()
  });
  test('容器在生产模式下创建多次是否会抛出异常', () => {
    //创建测试用例
    function toBeTested() {
      new Container(false);
      new Container(false);
    }
    //测试
    expect(() => toBeTested()).toThrowError();
  });
  test('容器在使用md5产生摘要信息后是否可以正常读取',()=>{
    //创建测试用例
    new Container()
    const con = Container.container
    class Test{}
    con?.bind(Test,{type:'a',instance:new Test},'[class]')
    //测试
    expect(con?.get(Test,'[class]')).toBeDefined()
  });
});