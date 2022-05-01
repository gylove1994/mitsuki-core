import { test } from '@jest/globals';
import { Mirai } from 'mirai-ts';
import { Module } from './decorators';
import { Container } from './ioc-container';
import {
  Mitsuki,
  MitsukiFactory,
} from './mitsuki-core';
import { ModuleOptions, Provider } from './types';
import 'reflect-metadata'

beforeEach(() => {
  //恢复IoC容器的初始状态
  Container.container = undefined;
});

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
