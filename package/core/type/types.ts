import { Container } from '../container';
import { LoggerLike } from '../../common/logger.adapter';
import Mirai, { EventType, MessageType } from 'mirai-ts';
import { OperatorFunction, tap, UnaryFunction } from 'rxjs';

export type ModuleOptions = {
  controller?: Constructor[];
  imports?:
    | Array<Constructor | DynamicModule>
    | (() => Promise<Array<DynamicModule | Constructor>> | Array<DynamicModule | Constructor>);
  exports?:
    | Array<string | Constructor>
    | (() => Promise<Array<string | Constructor>> | Array<DynamicModule | Constructor>);
  //todo object的避免
  provider?: Array<Provider | Constructor> | (() => Promise<Array<Provider | Constructor>>);
};

export type DynamicModule = ModuleOptions &
  Record<'name', string> &
  Partial<Record<ModuleHookName, (container: Container, mirai: Mirai) => void | Promise<void>>>;

export type BotEvent = 'message' | keyof EventType.EventMap | MessageType.ChatMessage['type'];

export type Provider = {
  provider: string;
  useFactory?: (...params: any[]) => any;
  useClass?: Constructor;
  useValue?: any;
  scope?: Scope;
};

export type Handler = {
  fc: (...args: Array<unknown>) => unknown;
  this: ThisType<unknown>;
  args: any[];
};

export type Fnc = (...args: Array<unknown>) => unknown;

export type paramInfo = {
  instance?: any;
  ProviderName?: string;
  factory?: () => object;
  pipe?: Array<MitsukiPipe | string | Constructor>;
};

export type ParamDecoratorInfo = { target: object; methodName: string | undefined | symbol; parameterIndex: number };

export function isProvider(arg: object | Provider): arg is Provider {
  return (arg as Provider).provider !== undefined;
}

//判断传入的函数是不是构造函数
export function isConstructor(f: any): f is Constructor {
  try {
    Reflect.construct(String, [], f);
    return true;
  } catch (err) {
    return false;
  }
}

//判断传入的参数是不是函数
export function isFunction(f: any) {
  if (typeof f == 'function') return true;
  return false;
}

export function isDirectInstance(f: any): f is DirectInstance {
  if (f.instance && f.pipe && !f.ProviderName) return true;
  return false;
}

export function isArray<T = any>(f: any): f is Array<T> {
  if (f.push) return true;
  return false;
}

export type DirectInstance = {
  instance: any;
  pipe?: MitsukiPipe[];
};

export type Constructor<T = any> = new (...args: any[]) => T;

export type ParamDecoratorFunc = (val: string, target: object, key: string, index: number) => void;

export type MethodDecoratorFunc = (
  val: string,
  target: object,
  propertyName: string,
  descriptor: PropertyDescriptor,
) => void;

export abstract class MitsukiPipe {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public transform(val: any): any {}
}

export abstract class RxPipe {
  public buildRxPipe():
    | OperatorFunction<any, any>
    | UnaryFunction<any, any>
    | Promise<OperatorFunction<any, any> | UnaryFunction<any, any>> {
    return tap();
  }
}

export function isMitsukiPipeInstance(val: any): val is MitsukiPipe {
  if (val.transform) {
    return true;
  } else {
    return false;
  }
}

export type ProviderOptions = {
  scope: Scope;
};

export enum Scope {
  DEFAULT = 1,
  MESSAGE,
  TRANSIENT,
}

export type HandlerMetadata = {
  event: BotEvent;
  pipes?: Array<OperatorFunction<any, any> | Constructor>;
};

export type MitsukiOptions = {
  logger?: (...args: any[]) => LoggerLike;
};

export type ScopeContent = Provider & Record<'container', Container>;

export function isScopeContent(val: any): val is ScopeContent {
  if (val.scope && val.container) {
    return true;
  }
  return false;
}

export interface ExceptionFilter {
  catch(exp: unknown): void;
}

export type ModuleHookName =
  | 'moduleCreated'
  | 'providersImported'
  | 'providersInstanced'
  | 'providersExported'
  | 'moduleConstructed';

export abstract class ModuleConstructed {
  public static moduleConstructed(con: Container, mirai: Mirai) {}
}
