import path from 'path';
import fs from 'node:fs';
import { Mirai, MiraiApiHttpSetting } from 'mirai-ts';
import 'reflect-metadata';
import {
  Constructor,
  GetType,
  ModuleOptions,
  ParamType,
  Provider,
} from './types';
//元信息的value
export const CONTROLLER_METADATA = 'ioc:controller';
export const PROVIDER_METADATA = 'ioc:provider';
export const METHOD_METADATA = 'ioc:method';
export const PARAM_METADATA = 'ioc:param';
export const CONTAINER_METADATA = 'ioc:container';
export const INIT_METADATA = 'ioc:init'
//元信息的key
export const MODULES_OPTIONS = 'moduleOptions';
export const CLASS_TYPE = 'classType';
export const METHOD_TYPE = 'methodType';

// mitsuki 主类
//todo 未完成的类
export class Mitsuki {
  public readonly mirai: Mirai;
  constructor(mirai:Mirai) {
    this.mirai = mirai;
  }
}

// mitsuki主类及IoC容器的工厂函数
//todo 未完成的方法
export function MitsukiFactory(module: Constructor,miraiApiHttpSetting?:MiraiApiHttpSetting) {
  new Container(false);
  module_core(module);
  //当未传入miraiApiHttpSetting参数时自动在项目根目录下寻找
  if(miraiApiHttpSetting == undefined && fs.existsSync(path.join(__dirname,'/miraiApiHttpSetting.json'))) 
    miraiApiHttpSetting = JSON.parse(fs.readFileSync(path.join(__dirname,'/miraiApiHttpSetting.json'),'utf-8'));
  const mirai = new Mirai(miraiApiHttpSetting);
  Reflect.defineMetadata(CLASS_TYPE,INIT_METADATA,Mirai);
  Container.container?.bind('mirai',{type:INIT_METADATA,instance:mirai});
  const mitsuki = new Mitsuki(mirai);
  return mitsuki;
}

//模块装饰器，用于将模块信息绑定在模块的元信息上
export function Module(moduleOptions?: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULES_OPTIONS, moduleOptions, target);
  };
}

//用于生成只用于添加标记的参数装饰器
// export function createParamDecorator(val:string){
//   return ():ParameterDecorator =>
//     (target,key,index) => {
//       Reflect.defineMetadata(PARAM_METADATA,val,target)
//   }
// }

//用于生成只用于添加标记的方法装饰器
export function createMethodDecorator(val: string) {
  return (): MethodDecorator => (target, name, descriptor: any) => {
    Reflect.defineMetadata(METHOD_TYPE, val, descriptor.value);
  };
}

//用于生成只用于添加标记的类装饰器
//todo 更改参数classType的类型
export function createClassDecorator(classType: string) {
  return (): ClassDecorator => (target) => {
    Reflect.defineMetadata(CLASS_TYPE, classType, target);
  };
}

export const Controller = createClassDecorator(CONTROLLER_METADATA);
export const Injectable = createClassDecorator(PROVIDER_METADATA);
//IoC容器的主类
//todo 开启了测试模式，在生产模式需要关闭
export class Container<T extends Record<string, unknown> = {}> {
  public static container?: Container;
  private map: Map<string, Record<string, unknown>>;
  constructor(testMode: boolean = true) {
    if (Container.container != undefined && testMode == false)
      throw new Error('容器只能被创建一次');
    this.map = new Map();
    Container.container = this;
  }
  public bind<K extends string, V extends Record<string, unknown>>(
    key: K,
    val: V,
  ): Container<T & Record<K, V>> {
    this.map.set(key, val);
    return this as Container<T & Record<K, V>>;
  }
  public get<K extends string>(key: K): GetType<T, K> {
    return this.map.get(key) as GetType<T, K>;
  }
}

//用于递归创建依赖实例，并将依赖项的实例存入IoC容器中
export function createInstance<T>(
  container: Container,
  constructor: Constructor<T>,
): T {
  const type = getMetaAndThrow(CLASS_TYPE, constructor);
  const param = Reflect.getMetadata(
    'design:paramtypes',
    constructor,
  ) as ParamType;
  const tobeInjected = [] as any[];
  param?.forEach((dependency) => {
    //首先尝试从容器中找到需要的注入的实例
    const instance = container.get(dependency.name) as Provider<any>;
    if (instance != undefined) {
      tobeInjected.push(instance.instance);
      return;
    } else {
      //如果容器中没有，则递归创建
      tobeInjected.push(createInstance(container, dependency));
    }
  });
  const provider: Provider<T> = {
    type,
    instance: new constructor(...tobeInjected),
  };
  container.bind(constructor.name, provider);
  return provider.instance;
}

//通过模组递归创建依赖实例
export function module_core(target: Object) {
  const container = Container.container;
  const moduleOptions = getMetaAndThrow(
    MODULES_OPTIONS,
    target,
  ) as ModuleOptions;
  if (container == undefined) throw new Error('IoC容器未创建');
  if (moduleOptions != undefined) {
    moduleOptions.imports?.forEach((dependency) => {
      createInstance(container, dependency);
    });
    moduleOptions.providers?.forEach((dependency) => {
      createInstance(container, dependency);
    });
    moduleOptions.controllers?.forEach((dependency) => {
      const instance = createInstance(container, dependency);
      //将有方法装饰器装饰的函数放入IoC容器，其名字前会加入前缀[method]
      const p = Object.getPrototypeOf(instance);
      const methodsNames = Object.getOwnPropertyNames(p).filter(
        (item) => !isConstructor(p[item]) && isFunction(p[item]),
      );
      methodsNames.forEach((methodsName) => {
        const fn = p[methodsName];
        const meta = Reflect.getMetadata(METHOD_TYPE, fn);
        //调用闭包
        function fnToCall() {
          return fn.call(instance);
        }
        if (meta != undefined) {
          container.bind('[method]' + methodsName, {
            type: meta,
            fn: fnToCall,
          });
        }
      });
    });
    moduleOptions.modules?.forEach((module) => {
      module_core(module);
    });
  }
}

//获取元信息，如果元信息未定义则抛出异常
export function getMetaAndThrow<T = any>(
  metaKey: string,
  target: Object,
  info?: string,
): T;
export function getMetaAndThrow<T = any>(
  metaKey: Symbol,
  target: Object,
  info?: string,
): T;
export function getMetaAndThrow<T = any>(
  metaKey: string | Symbol,
  target: Object,
  info?: string,
): T {
  const meta = Reflect.getMetadata(metaKey, target);
  if (meta == undefined)
    throw new Error(
      '未获取到对应的的元信息\ninfo = ' +
        info +
        '\nmetaKey =' +
        metaKey +
        '\ntarget=' +
        target +
        '\n',
    );
  return meta as T;
}

//判断传入的函数是不是构造函数
export function isConstructor(f: Function) {
  try {
    Reflect.construct(String, [], f);
  } catch (e) {
    return false;
  }
  return true;
}

//判断传入的参数是不是函数
export function isFunction(f: any) {
  if (typeof f == 'function') return true;
  return false;
}
