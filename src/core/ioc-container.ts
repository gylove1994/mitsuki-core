import { Mirai } from 'mirai-ts';
import md5 from 'md5';
import {
  CLASS_TYPE,
  Constructor,
  INIT_METADATA,
  METHOD_TYPE,
  ModuleOptions,
  MODULES_OPTIONS,
  ORIGIN_METHOD,
  OUTER_METADATA,
  ParamType,
  Provider,
} from './types';
import { getMetaAndThrow, isConstructor, isFunction } from './utils';
import 'reflect-metadata';
import Log4js from 'log4js';
import { Logger } from 'mirai-ts';
Log4js.getLogger('ioc-container').level = 'debug';

//todo 开启了测试模式，在生产模式需要关闭
export class Container {
  public static container?: Container;
  private map: Map<string, Record<string, unknown>>;
  constructor(testMode: boolean = true) {
    const logger = Log4js.getLogger('ioc-container');
    if (Container.container != undefined && testMode == false)
      throw new Error('容器只能被创建一次');
    this.map = new Map();
    Container.container = this;
    logger.debug('ioc容器已创建');
  }
  //直接使用字符串作为键值，可能会造成重名(不推荐使用)
  public bind(key: string, val: Provider): this;
  //使用原型作为唯一标识符，通过md5计算得出其摘要，并将摘要作为键名保存(推荐)
  public bind(proto: Object, val: Provider, prefix?: string): this;

  public bind(key: string | Object, val: Provider, prefix?: string) {
    const logger = Log4js.getLogger('ioc-container');
    if (typeof key == 'string') {
      logger.debug('通过字符串模式向IoC容器中添加实例，实例id：' + key);
      this.map.set(key, val);
      return this;
    } else {
      logger.debug(
        '通过md5模式向IoC容器中添加实例,实例id：' +
          prefix +
          md5(key.toString()),
      );
      this.map.set(prefix + md5(key.toString()), val);
      return this;
    }
  }
  //直接使用键值读取内容
  public get<T = any>(key: string): T | undefined;
  //使用原型的md5值读取内容,若不提供prefix则会启用模糊匹配模式，性能会有所降低
  public get<T = any>(key: object, prefix?: string): T | undefined;

  public get<T = any>(key: string | object, prefix?: string): T | undefined {
    const logger = Log4js.getLogger('ioc-container');
    if (typeof key == 'string') {
      const keys = [...this.map.keys()];
      const res = keys.filter((val) => {
        return val.search(key) > 0;
      });
      if (res.length > 1)
        throw new Error('ioc容器中有多个符合该模糊匹配的内容');
      const val = this.map.get(res[0]) as T | undefined;
      if (val == undefined) {
        logger.debug(
          'IoC容器中未找到实例id：' +
            md5(key.toString()) +
            '的实例对象，IoC容器将返回undefined，可能会引发未知错误。',
        );
        return undefined;
      }
      logger.debug('IoC容器中找到实例id：' + key + '的实例对象。');
      return val;
    } else if (prefix != undefined) {
      const res = this.map.get(prefix + md5(key.toString())) as T | undefined;
      if (res == undefined) {
        logger.warn(
          'IoC容器中未找到实例id：' +
            prefix +
            md5(key.toString()) +
            '的实例对象，IoC容器将返回undefined，可能会引发未知错误。',
        );
        return undefined;
      }
      logger.debug(
        'IoC容器中找到实例id：' + prefix + md5(key.toString()) + '的实例对象。',
      );
      return res;
    } else {
      //模糊搜索
      logger.debug(
        '正在使用模糊匹配模式从IoC容器中获取对象，性能较差,不推荐使用。',
      );
      const keys = [...this.map.keys()];
      const res = keys.filter((val) => {
        return val.search(md5(key.toString())) > 0;
      });
      if (res.length > 1)
        throw new Error('ioc容器中有多个符合该模糊匹配的内容');
      const val = this.map.get(res[0]) as T | undefined;
      if (val == undefined) {
        logger.debug(
          'IoC容器中未找到实例id：' +
            md5(key.toString()) +
            '的实例对象，IoC容器将返回undefined，可能会引发未知错误。',
        );
        return undefined;
      }
      logger.debug('IoC容器中找到实例id：' + res[0] + '的实例对象。');
      return val;
    }
  }
  //直接使用原型对象创建实例并保存至IoC容器中
  public create(obj: Constructor, prefix: string, ...param:Object[]) {
    let params;
    if(param == undefined){
      params = getParamInstance(obj);
    }else{
      params = param;
    }
    const type = Reflect.getMetadata('classType', obj);
    const instance: Provider = { type: type, instance: new obj(params) };
    this.bind(obj, instance, prefix);
  }
  //获取所有在IoC容器中指定类型的方法
  public getMethods(type: string) {
    const logger = Log4js.getLogger('ioc-container');
    const fn: Function[] = [];
    this.map.forEach((value, key) => {
      if (type === value.type) {
        fn.push(value.instance as Function);
        logger.debug(key + '已被类型：' + type + '获取。');
      }
    });
    return fn;
  }
  public update<T>(newVal: Provider<T>,searchKey:string):void;

  public update<T>(newVal: Provider<T>,obj:Constructor<T>,prefix?:string):void;

  public update<T>(newVal: Provider<T>,obj:Constructor<T> | string,prefix?:string){
    const logger = Log4js.getLogger('ioc-container');
    let res;
    if(typeof obj === 'string'){
      const keys =  [...this.map.keys()];
      res = keys.filter((val) => {
        return val.search(obj) > 0;
      });
    }else{
      const keys =  [...this.map.keys()];
      res = keys.filter((val) => {
        return val.search(md5(obj.toString())) > 0;
      });
    }
    if (res.length > 1)
      throw new Error('ioc容器中有多个符合该模糊匹配的内容');
    if(res.length === 1 && typeof obj === 'function'){
      this.map.delete(res[0]);
      this.bind(obj,newVal,prefix);
      logger.debug('更新完成');
    }else if(res.length === 1 && typeof obj === 'string'){
      this.map.delete(res[0]);
      this.bind(res[0],newVal);
      logger.debug('更新完成');
    }
    if(res.length === 0 && typeof obj === 'function'){
      this.bind(obj,newVal,prefix);
      logger.debug('未找到更新内容，开始直接创建');
    }else if(res.length === 0 && typeof obj === 'string'){
      logger.debug('未找到所指定的更新内容' + '，将不会对内容进行更新，可能会引发未知错误。');
    }
  }
}

//用于递归创建依赖实例，并将依赖项的实例存入IoC容器中
export function createInstance<T>(
  container: Container,
  constructor: Constructor<T>,
): T {
  const logger = Log4js.getLogger('ioc-container');
  logger.debug('正在构造名为：' + constructor.name + '的依赖实例。');
  const type = getMetaAndThrow(CLASS_TYPE, constructor);
  const tobeInjected = getParamInstance(constructor);
  const provider: Provider<T> = {
    type,
    instance: new constructor(...tobeInjected),
  };
  container.bind(constructor, provider, '[class]');
  logger.debug('构造结束。');
  return provider.instance;
}

//通过模组递归创建依赖实例
export function module_core(target: Object) {
  const logger = Log4js.getLogger('ioc-container');
  const container = Container.container;
  const moduleOptions = getMetaAndThrow(
    MODULES_OPTIONS,
    target,
  ) as ModuleOptions;
  if (container == undefined) throw new Error('IoC容器未创建');
  if (moduleOptions != undefined) {
    moduleOptions.imports?.forEach((dependency) => {
      const val = {type:OUTER_METADATA,instance:dependency} as Provider;
      container.bind(Object.getPrototypeOf(dependency).constructor,val,'[class]');
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
        
        //todo 可能的错误
        // const tobeInjected = getParamInstance(fn);
        // console.log(tobeInjected);
        const meta = Reflect.getMetadata(METHOD_TYPE, fn);
        //调用闭包
        //todo 改用async/await实现(未验证)
         async function fnToCall() {
          await fn(instance);
        }
        if (meta != undefined) {
          container.bind(
            Reflect.getMetadata(ORIGIN_METHOD,fn),
            {
              type: meta,
              instance: fnToCall,
            },
            '[method]',
          );
          logger.info(
            '方法名：' +
              methodsName +
              '方法类型：' +
              meta +
              ' 已被IoC容器接受。',
          );
        }
      });
    });
    moduleOptions.modules?.forEach((module) => {
      module_core(module);
    });
  }
}

//实例化方法参数列表
export function getParamInstance<T>(constructor: Constructor<T>) {
  const logger = Log4js.getLogger('ioc-container');
  logger.debug('正在实例化方法' + constructor.name + '的参数列表');
  const container = Container.container;
  if (container == undefined) throw new Error('IoC容器未创建');
  const param = Reflect.getMetadata(
    'design:paramtypes',
    constructor,
  ) as ParamType;
  if (param === undefined) {
    logger.debug('参数列表为空！');
    return [] as any[];
  }
  const tobeInjected = [] as any[];
  param?.forEach((dependency) => {
    //首先尝试从容器中找到需要的注入的实例
    const instance = container.get(dependency) as Provider<any>;
    if (instance != undefined) {
      logger.debug(
        '所需的参数' + dependency.name + '已存在于IoC容器中，将不会重复创建。',
      );
      tobeInjected.push(instance.instance);
      return;
    } else {
      //如果容器中没有，则递归创建
      logger.debug(
        '所需的参数' + dependency.name + '不在IoC容器中，将自动递归创建。',
      );
      tobeInjected.push(createInstance(container, dependency));
    }
    logger.debug('参数构造完毕');
  });
  return tobeInjected;
}
