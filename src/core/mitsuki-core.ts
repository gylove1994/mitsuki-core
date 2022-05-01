import path from 'path';
import fs from 'node:fs';
import md5 from 'md5';
import { Mirai, MiraiApiHttpSetting } from 'mirai-ts';
import 'reflect-metadata';
import {
  CLASS_TYPE,
  Constructor,
  INIT_METADATA,
  ModuleOptions,
  ParamType,
  Provider,
} from './types';
import { Container, module_core } from './ioc-container';

// mitsuki 主类
//todo 未完成的类
export class Mitsuki {
  public readonly mirai: Mirai;
  constructor(mirai: Mirai) {
    this.mirai = mirai;
  }
}

// mitsuki主类及IoC容器的工厂函数
//todo 未完成的方法
export function MitsukiFactory(
  module: Constructor,
  miraiApiHttpSetting?: MiraiApiHttpSetting,
) {
  new Container(false);
  Reflect.defineMetadata(CLASS_TYPE, INIT_METADATA, Mirai);
  module_core(module);
  //当未传入miraiApiHttpSetting参数时自动在项目根目录下寻找
  if (
    miraiApiHttpSetting == undefined &&
    fs.existsSync(path.join(__dirname, '/miraiApiHttpSetting.json'))
  )
    miraiApiHttpSetting = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '/miraiApiHttpSetting.json'),
        'utf-8',
      ),
    );
  const mirai = new Mirai(miraiApiHttpSetting);
  Container.container?.bind(Mirai, { type: INIT_METADATA, instance: mirai },'[class]');
  const mitsuki = new Mitsuki(mirai);
  return mitsuki;
}



