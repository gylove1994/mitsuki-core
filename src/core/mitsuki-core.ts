import path from 'path';
import fs from 'node:fs';
import md5 from 'md5';
import { Mirai, MiraiApiHttpSetting } from 'mirai-ts';
import 'reflect-metadata';
import {
  Constructor,
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
export const INIT_METADATA = 'ioc:init';
//元信息的key
export const MODULES_OPTIONS = 'moduleOptions';
export const CLASS_TYPE = 'classType';
export const METHOD_TYPE = 'methodType';

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
export class Container {
  public static container?: Container;
  private map: Map<string, Record<string, unknown>>;
  constructor(testMode: boolean = true) {
    if (Container.container != undefined && testMode == false)
      throw new Error('容器只能被创建一次');
    this.map = new Map();
    Container.container = this;
  }
  //直接使用字符串作为键值，可能会造成重名(不推荐使用)
  public bind(key: string, val: Provider): this;
  //使用原型作为唯一标识符，通过md5计算得出其摘要，并将摘要作为键名保存(推荐)
  public bind(proto: Object, val: Provider, prefix?:string): this;

  public bind(key: string | Object, val: Provider, prefix?:string) {
    if (typeof key == 'string') {
      this.map.set(key, val);
      return this;
    } else {
      this.map.set(prefix + md5(key.toString()),val)
      return this;
    }
  }
  //直接使用键值读取内容
  public get<T = any>(key:string): T | undefined;
  //使用原型的md5值读取内容,若不提供prefix则会启用模糊匹配模式，性能会有所降低
  public get<T = any>(key:Object, prefix?:string): T | undefined;

  public get<T = any>(key: string | Object,prefix?:string): T | undefined{
    if(typeof key == 'string'){
      return this.map.get(key) as T | undefined; 
    }else if(prefix != undefined){
      return this.map.get(prefix + md5(key.toString())) as T | undefined;
    }else{
      //模糊搜索
      const keys = [...this.map.keys()];
      const res = keys.filter(val => RegExp('/'+md5(key.toString()+'/')).test(val));
      if(res.length > 1) throw new Error('ioc容器中有多个符合该模糊匹配的内容');
      return this.map.get(res[0]) as T | undefined;
    }
  }
}

//用于递归创建依赖实例，并将依赖项的实例存入IoC容器中
export function createInstance<T>(
  container: Container,
  constructor: Constructor<T>,
): T {
  const type = getMetaAndThrow(CLASS_TYPE, constructor);
  const tobeInjected = getParamInstance(constructor);
  const provider: Provider<T> = {
    type,
    instance: new constructor(...tobeInjected),
  };
  container.bind(constructor, provider,'[class]');
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
      //todo 待测试
      const p = Object.getPrototypeOf(instance);
      const methodsNames = Object.getOwnPropertyNames(p).filter(
        (item) => !isConstructor(p[item]) && isFunction(p[item]),
      );
      methodsNames.forEach((methodsName) => {
        //todo 收集参数
        const fn = p[methodsName];
        const tobeInjected = getParamInstance(fn);
        const meta = Reflect.getMetadata(METHOD_TYPE, fn);
        //调用闭包
        //todo 改用async/await实现
        function fnToCall() {
          return fn.call(instance, ...tobeInjected);
        }
        if (meta != undefined) {
          container.bind(fn, {
            type: meta,
            instance: fnToCall,
          },'[method]');
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

//todo 待测试
//实例化方法参数列表（数据耦合）
export function getParamInstance<T>(constructor: Constructor<T>) {
  const container = Container.container;
  if (container == undefined) throw new Error('IoC容器未创建');
  const param = Reflect.getMetadata(
    'design:paramtypes',
    constructor,
  ) as ParamType;
  const tobeInjected = [] as any[];
  param?.forEach((dependency) => {
    //首先尝试从容器中找到需要的注入的实例
    const instance = container.get(dependency) as Provider<any>;
    if (instance != undefined) {
      tobeInjected.push(instance.instance);
      return;
    } else {
      //如果容器中没有，则递归创建
      tobeInjected.push(createInstance(container, dependency));
    }
  });
  return tobeInjected;
}
