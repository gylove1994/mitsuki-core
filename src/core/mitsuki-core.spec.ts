import { test } from '@jest/globals';
import { Mirai } from 'mirai-ts';
import { Module } from './decorators';
import { Container } from './ioc-container';
import {
  Mitsuki,
  MitsukiFactory,
} from './mitsuki-core';
import Log4js from 'log4js'
import { ModuleOptions, Provider } from './types';
import 'reflect-metadata'

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

describe('Mitsuki主类的测试', () => {
  test('Mitsuki实例的创建', () => {
    //测试
    expect(new Mitsuki(new Mirai())).toBeDefined();
  });
  test('Mitsuki工厂创建时IoC容器是否成功创建', () => {
    //创建测试用例
    @Module({})
    class Test {}
    MitsukiFactory(Test);
    //测试
    expect(Container.container).toBeDefined();
  });
});
