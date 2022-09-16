import { MessageType } from 'mirai-ts';
import {
  ModuleOptions,
  paramInfo,
  BotEvent,
  MitsukiPipe,
  HandlerMetadata,
  Constructor,
  ProviderOptions,
  RxPipe,
} from './type/types';
import 'reflect-metadata';
import { Container } from './container';
import { OperatorFunction, pipe } from 'rxjs';
export const MODULES_OPTIONS = 'MODULES_OPTIONS'.toLowerCase();
export const CONTAINER = 'CONTAINER'.toLowerCase();
export const CLASS_TYPE = 'CLASS_TYPE'.toLowerCase();
export const PROVIDER_INFO = 'PROVIDER_INFO'.toLowerCase();
export const METHODS_TYPE = 'METHODS_TYPE'.toLowerCase();
export const CLASS_OPTIONS = 'CLASS_OPTIONS'.toLowerCase();

//模块装饰器，用于将模块信息绑定在模块的元信息上
//done
export function Module(moduleOptions?: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULES_OPTIONS, moduleOptions, target);
    Reflect.defineMetadata(CONTAINER, new Container(target.name), target);
    Reflect.defineMetadata(CLASS_TYPE, 'ioc:module', target);
  };
}

//用于生成只用于添加标记的类装饰器
export function createClassDecorator<T extends Array<any>>(classType: string, fn?: (target: any, ...rest: T) => void) {
  return (...rest: T): ClassDecorator =>
    (target) => {
      Reflect.defineMetadata(CLASS_TYPE, classType, target);
      fn ? fn(target, ...rest) : undefined;
    };
}

export const Controller = createClassDecorator('ioc:controller');
export const Injectable =
  (option?: ProviderOptions): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(CLASS_TYPE, 'ioc:provider', target);
    if (option) {
      Reflect.defineMetadata(CLASS_OPTIONS, option, target);
    }
  };
//用于生成只用于添加标记的方法装饰器
export function createMethodDecorator(methodType: string) {
  return (): MethodDecorator => (target, propertyKey, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(METHODS_TYPE, methodType, descriptor.value);
  };
}

export const Handler =
  (event: BotEvent, ...pipes: Array<OperatorFunction<any, any> | Constructor>): MethodDecorator =>
  (target, propertyKey, descriptor: PropertyDescriptor) => {
    const metadata: HandlerMetadata = {
      event,
      pipes,
    };
    Reflect.defineMetadata(METHODS_TYPE, metadata, descriptor.value);
  };

export function Inject(info: paramInfo): ParameterDecorator {
  return (target, methodName, parameterIndex) => {
    const key = { target, methodName, parameterIndex };
    Container.ParamDecoratorInfoArray.push(key);
    Container.paramInfoMap.set(key, info);
  };
}

export function createParamDecorator(ProviderName: string, ...buildInPipe: Array<MitsukiPipe | string | Constructor>) {
  return (...pipe: Array<MitsukiPipe | string | Constructor>): ParameterDecorator =>
    (target, methodName, parameterIndex) => {
      const key = { target, methodName, parameterIndex };
      Container.ParamDecoratorInfoArray.push(key);
      Container.paramInfoMap.set(key, { ProviderName, pipe: buildInPipe.concat(pipe) });
    };
}

export function createParamInterceptor(ProviderName: string, ...tarns: Array<Constructor | MitsukiPipe | string>) {
  return (...pipe: Array<Constructor | MitsukiPipe | string>): ParameterDecorator =>
    (target, methodName, parameterIndex) => {
      const key = { target, methodName, parameterIndex };
      Container.ParamDecoratorInfoArray.push(key);
      Container.paramInfoMap.set(key, {
        ProviderName,
        instance: ProviderName,
        pipe: tarns.concat(pipe),
      });
    };
}

export const MiraiCore = createParamDecorator('[init:mirai]Mirai-core');

export const GetMsg =
  (event: BotEvent, ...pipe: MitsukiPipe[]): ParameterDecorator =>
  (target, methodName, parameterIndex) => {
    const key = { target, methodName, parameterIndex };
    Container.ParamDecoratorInfoArray.push(key);
    Container.paramInfoMap.set(key, { ProviderName: '[init:data]' + event, pipe });
  };

export const Data =
  (...pipe: Array<Constructor | MitsukiPipe | string>): ParameterDecorator =>
  (target, methodName, parameterIndex) => {
    const key = { target, methodName, parameterIndex };
    Container.ParamDecoratorInfoArray.push(key);
    Container.paramInfoMap.set(key, {
      ProviderName: '[init:dataPlaceholder]',
      instance: '[init:dataPlaceholder]',
      pipe,
    });
  };

export const GetMethodParamTypes: MethodDecorator = (target, name) => {
  const params = Reflect.getMetadata('design:paramtypes', target, name);
  Container.paramTypeArray.push({ target, name, params });
};

//todo 有问题的
export const ToThrow: MethodDecorator = (target, name, des) => {
  const o = des.value as any;
  const keys = Reflect.getOwnMetadataKeys(o);
  const fc = async function (...args: any[]) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await o(args);
    } catch (error) {
      throw error;
    }
  };
  keys.forEach((val) => {
    const metaVal = Reflect.getMetadata(val, o);
    Reflect.defineMetadata(val, metaVal, o);
    console.log(val);
  });
  des.value = fc as any;
};
