import { Controller, createClassDecorator, createMethodDecorator, Injectable, Module } from "./decorators";
import { Container } from "./ioc-container";
import { CLASS_TYPE, METHOD_TYPE, ModuleOptions, MODULES_OPTIONS } from "./types";

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