import test from 'jest';
import { CLASS_OPTIONS, METHODS_TYPE } from './decorator';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Constructor,
  Handler,
  isConstructor,
  isFunction,
  ParamDecoratorInfo,
  paramInfo,
  Provider,
  Fnc,
  isDirectInstance,
  HandlerMetadata,
  isMitsukiPipeInstance,
  MitsukiPipe,
  Scope,
  ScopeContent,
  isScopeContent,
  ProviderOptions,
  DynamicModule,
  ModuleHookName,
  RxPipe,
} from './type/types';
import { isProvider, ModuleOptions } from './type/types';
import { Logger, LoggerLike } from '../common/logger.adapter';
import { MODULES_OPTIONS, CONTAINER, CLASS_TYPE } from './decorator';
import { EventEmitter } from 'events';
import { Observable, OperatorFunction, tap } from 'rxjs';
import Mirai from 'mirai-ts';
import chalk from 'chalk';
import { extend } from '../utils/extend';
import { isOperatorFunction } from '../utils/is';

export class Container {
  private event = new EventEmitter();
  private static hooker = new EventEmitter();
  //发布时将改为 private
  public static global: Map<string, object> = new Map();
  public static logger: LoggerLike = Logger.getLogger('MitsukiApplication');
  public static paramInfoMap: Map<ParamDecoratorInfo, paramInfo> = new Map();
  public static paramTypeArray: Array<any> = [];
  public static ParamDecoratorInfoArray: ParamDecoratorInfo[] = [];
  public static ContainerArray: Container[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-types
  //todo 准备废弃的属性:handlerArray
  public handlerArray: Handler[];
  private instanceMap: Map<string, object>;
  public containerName: string;
  public exportedInstance: Map<string, object>;
  constructor(name: string) {
    this.containerName = name;
    this.instanceMap = new Map();
    this.exportedInstance = new Map();
    this.handlerArray = [];
    Container.ContainerArray.push(this);
  }
  public static setToInstanceMap(container: Container, key: string, val: object, noLog?: boolean) {
    if (container.instanceMap.has(key)) {
      Container.logger.error(`导入模块"${container.containerName}"中的实例名称：${key} 重复`);
      throw new Error(`导入模块"${container.containerName}"中的实例名称：${key} 重复`);
    }
    if (!noLog) {
      Container.logger.info(`实例名称：${key} 已导入模块："${container.containerName}"`);
    }
    container.instanceMap.set(key, val);
    container.event.emit(key, val);
  }
  public async getInstance(name: string, rejectTime?: number, noErr?: boolean) {
    //todo 不好的方法
    if (name == '[init:ProviderMap]') {
      return this.instanceMap;
    }
    Container.logger.info(`即将从依赖库：${this.containerName} 中获得实例：${name}`);
    if (this.instanceMap.has(name)) {
      return this.instanceMap.get(name);
    } else {
      Container.logger.info(`即将从公共依赖库中获得实例：${name}`);
      if (Container.global.has(name)) {
        Container.logger.info(`从公共依赖库中获得实例：${name}`);
        return Container.global.get(name);
      }
      Container.logger.info(`公共依赖库中不存在实例：${name}`);
      Container.logger.info(`可能由于所需实例：${name} 没有实例化完成，等待回调中`);
      return new Promise((resolve, reject) => {
        this.event.once(name, (instance) => {
          Container.logger.info(`所需实例：${name} 回调已触发`);
          resolve(instance);
        });
        setTimeout(
          () => {
            // Container.logger.error(`获得所需实例：${name} 的回调超时，请检查是否存在该实例`);
            noErr == true ? resolve(undefined) : reject(`获得所需实例：${name} 的回调超时，请检查是否存在该实例`);
          },
          rejectTime ? rejectTime : 3000,
        );
      });
    }
  }
  public static getProviderToken(providers: Array<Provider | Constructor>): string[] {
    return providers.map((val) => {
      if (isProvider(val)) {
        return val.provider;
      } else {
        //todo 可能有问题
        return (val as Constructor).name;
      }
    });
  }
  //实例化provider
  //todo 解析Provider
  public static async instanceProvider(
    container: Container,
    constructor: Constructor,
    name: string,
    //todo 使参数可选
    providers: Array<Provider | Constructor>,
    scope?: Scope,
    noSave?: boolean,
  ): Promise<object | ScopeContent> {
    if (scope) {
      if (scope && scope !== Scope.DEFAULT) {
        const scopeContent: ScopeContent = {
          scope: scope,
          container: container,
          useClass: constructor,
          provider: name,
        };
        container.setToInstanceMap(name, scopeContent);
        return scopeContent;
      }
    }
    Container.logger.info(`将准备实例化${name} 的依赖列表`);
    const paramsInstanceArray: Promise<any>[] | undefined = await Container.instanceParam(
      container,
      constructor,
      constructor,
      providers,
    );
    if (paramsInstanceArray != undefined) {
      return Promise.all(paramsInstanceArray).then((val) => {
        Container.logger.info(`实例：${name} 的依赖列表构建完成`);
        const obj = Reflect.construct(constructor, val);
        Container.logger.info(`实例：${name} 构建完成`);
        if (noSave === undefined || noSave === false) {
          Container.setToInstanceMap(container, name, obj);
        }
        return obj;
      });
    } else {
      const obj = new constructor();
      Container.logger.info(`实例：${name} 构建完成`);
      Container.setToInstanceMap(container, name, obj);
      return obj;
    }
  }
  public static async useParamInfoCreateInstance(
    paramInfoKey: ParamDecoratorInfo,
    container: Container,
    providers: Array<Provider | Constructor>,
  ) {
    const key = Container.ParamDecoratorInfoArray.find((val) => {
      if (
        val.methodName === paramInfoKey.methodName &&
        val.parameterIndex === paramInfoKey.parameterIndex &&
        val.target == paramInfoKey.target
      ) {
        return true;
      }
    });
    if (!key) return undefined;
    const info = Container.paramInfoMap.get(key);
    //如果存在参数装饰器的信息则按参数装饰器的方式注入，顺序为 1.直接实例 2.提供的特征名
    if (info) {
      Container.logger.info(`通过参数装饰器注入依赖：${info.ProviderName}`);
      if (info.instance) {
        Container.logger.info(`假依赖：${info.ProviderName} 注入完毕，等待被拦截器修改`);
        return {
          instance: info.instance,
          pipe: info.pipe,
        };
      } else if (info.ProviderName) {
        //检查依赖库中是否有该依赖
        //todo 可优化
        const providerNames = this.getProviderToken(providers);
        const keys: string[] = [];
        for (const key of container.instanceMap.keys()) {
          keys.push(key);
        }
        for (const key of Container.global.keys()) {
          keys.push(key);
        }
        // if (providerNames && providerNames.concat(keys).find((val) => info.ProviderName == val)) {
        //使用管道转换值
        if (info.pipe) {
          Container.logger.info(
            `即将准备从依赖库"${container.containerName}"中获取实例:${info.ProviderName}，此行为可能因为超时而失败`,
          );
          let val = await container.getInstance(info.ProviderName);
          val = await Container.transformPipeValue(val, container, paramInfoKey, info.pipe);
          return val;
        }
        //从依赖库中获得依赖
        Container.logger.info(
          `即将准备从依赖库"${container.containerName}"中获取实例:${info.ProviderName}，此行为可能因为超时而失败`,
        );
        return container.getInstance(info.ProviderName);
        // } else {
        //   Container.logger.error(`所需要的依赖${info.ProviderName}在依赖库中不存在，请将其添加至该模组的provider`);
        //   throw new Error(`所需要的依赖${info.ProviderName}在依赖库中不存在，请将其添加至该模组的provider`);
        // }
      } else {
        Container.logger.error('错误的参数装饰器:' + paramInfoKey);
        throw new Error('错误的参数装饰器:' + paramInfoKey);
      }
    } else {
      return undefined;
    }
  }
  public static async instanceParam(
    container: Container,
    fn: Fnc | Constructor,
    proto: any,
    providers: Array<Provider | Constructor>,
  ) {
    //获得provider的构造函数的参数类型数组
    Container.logger.info(`将准备实例化${fn.name} 的依赖列表`);
    let getParamsTypes: Constructor[] | undefined;
    if (isConstructor(fn)) {
      getParamsTypes = Reflect.getMetadata('design:paramtypes', proto);
    } else {
      getParamsTypes = Reflect.getMetadata('design:paramtypes', proto, fn.name);
    }
    const paramsInstanceArray: Promise<any>[] | undefined = getParamsTypes?.map(async (param, index) => {
      //通过参数装饰器实例化
      const paramInfoKey: ParamDecoratorInfo = {
        target: proto,
        methodName: isConstructor(fn) ? undefined : fn.name,
        parameterIndex: index,
      };
      const key = Container.ParamDecoratorInfoArray.find((val) => {
        if (
          val.methodName === paramInfoKey.methodName &&
          val.parameterIndex === paramInfoKey.parameterIndex &&
          val.target == paramInfoKey.target
        ) {
          return true;
        }
      });
      let info;
      if (key) {
        info = Container.paramInfoMap.get(key);
      }
      const val = await Container.useParamInfoCreateInstance(paramInfoKey, container, providers);
      if (val) {
        if (isScopeContent(val) && val.scope == Scope.TRANSIENT) {
          if (val.useClass) {
            return await Container.instanceProvider(val.container, val.useClass, val.provider, [], Scope.DEFAULT, true);
          } else if (val.useFactory) {
            return await val.useFactory();
          } else if (val.useValue) {
            return extend(val.useValue, true);
          }
        }
        Container.logger.info(`使用参数装饰器实例化"${info ? info.ProviderName : param.name}"完成`);
        return val;
      } else {
        //若没有装饰器，则开始准备直接注入
        if (
          fn === String ||
          fn === Boolean ||
          fn === undefined ||
          fn === Array ||
          fn === Object ||
          fn === Function ||
          fn === Number
        ) {
          Container.logger.error(
            `'ioc容器无法判断内置类的实例对象的注入，请使用方法参数装饰器注明所需注入实例的provider'`,
          );
          throw new Error('ioc容器无法判断内置类的实例对象的注入，请使用方法参数装饰器注明所需注入实例的provider。');
        }
        //检查依赖库中是否有该依赖
        //todo 可优化
        const providerNames = this.getProviderToken(providers);
        const keys: string[] = [];
        for (const key of container.instanceMap.keys()) {
          keys.push(key);
        }
        //从依赖库中获得依赖
        // if (providerNames && providerNames.concat(keys).find((val) => param.name == val)) {
        Container.logger.info(
          `即将准备从依赖库"${container.containerName}"中获取实例:${param.name}，此行为可能因为超时而失败`,
        );
        return await container.getInstance(param.name);
        // } else {
        //   Container.logger.error(`所需要的依赖${param.name}在依赖库中不存在，请将其添加至该模组的provider`);
        //   throw new Error(`所需要的依赖${param.name}在依赖库中不存在，请将其添加至该模组的provider`);
        // }
      }
    });
    if (paramsInstanceArray) {
      const res = await Promise.all(paramsInstanceArray);
      //对于Scope.TRANSIENT的参数进行实例化
      if (isConstructor(fn)) {
        const mappedRes = res.map(async (val) => {
          if (isScopeContent(val) && val.scope == Scope.TRANSIENT) {
            if (val.useClass) {
              return await Container.instanceProvider(
                val.container,
                val.useClass,
                val.provider,
                [],
                Scope.DEFAULT,
                true,
              );
            } else if (val.useFactory) {
              return await val.useFactory();
            } else if (val.useValue) {
              return extend(val.useValue, true);
            }
          } else if (isScopeContent(val) && val.scope == Scope.MESSAGE) {
            Container.logger.error(
              `参数：${val.provider} 所设置为Scope.MESSAGE，只能在handler中实例化，不能在构造函数中注入，请检查`,
            );
            throw Error(
              `参数：${val.provider} 所设置为Scope.MESSAGE，只能在handler中实例化，不能在构造函数中注入，请检查`,
            );
          }
          return val;
        });
        return await Promise.all(mappedRes);
      }
      return res;
    } else {
      return [];
    }
  }
  //构建模块
  public static async buildModule(
    rootModule: Constructor | DynamicModule,
    mirai: Mirai,
    passProviders?: Map<string, object>,
  ): Promise<Container[]> {
    Container.logger.info(`即将开始解析模块：${rootModule.name}`);
    const module_options: ModuleOptions = Reflect.getMetadata(MODULES_OPTIONS, rootModule)
      ? Reflect.getMetadata(MODULES_OPTIONS, rootModule)
      : rootModule;
    if (module_options.imports && typeof module_options.imports == 'function') {
      module_options.imports = await module_options.imports();
    }
    const container: Container = Reflect.getMetadata(CONTAINER, rootModule)
      ? Reflect.getMetadata(CONTAINER, rootModule)
      : (rootModule as DynamicModule).container;
    //生命周期钩子moduleCreated触发
    Container.hooker.emit('moduleCreated', this);
    if ((rootModule as any).moduleCreated) {
      await (rootModule as any).moduleCreated(container);
    }
    //todo 解析provider和构造函数
    //如果允许从父容器传入provider并且父容器确实传入了provider，将传入的放入instanceMap
    if (module_options.getProviderFromFather === true && passProviders) {
      passProviders.forEach((val, key) => {
        container.setToInstanceMap(key, val);
      });
    }
    //创建用于保存需要传入provider的模组，延后他们的创建
    const needProviderToInstanceModules: Array<Constructor | DynamicModule> = [];
    //递归构建所导入的模块
    const modules = module_options.imports?.map(async (module: any) => {
      //todo 临时方案
      if (module.getProviderFromFather) {
        needProviderToInstanceModules.push(module);
        return;
      }
      const created = await this.buildModule(module, mirai);
      //将导入类所导出的实例存入该实例类的实例仓库中
      created[0].exportedInstance.forEach((instance, key) => {
        Container.setToInstanceMap(container, key, instance);
        Container.logger.info(`成功将"${key}"导入模块：${rootModule.name}`);
      });
      return created;
    });
    //等待子模块导入完成
    const r = modules ? await Promise.all(modules) : [];
    //去除空项
    const rest: Container[][] = [];
    r.forEach((val) => {
      if (val) {
        rest.push(val);
      }
    });
    Container.logger.info(`${rootModule.name} 的子模块导入完成`);
    //生命周期钩子providersImported触发
    this.hooker.emit('providersImported', container, mirai);
    if ((rootModule as any).providersImported) {
      await (rootModule as any).providersImported(container, mirai);
    }
    //构建provider
    Container.logger.info(`模块：${rootModule.name} 将开始实例化provider`);
    let providers: Array<Constructor | Provider> = [];
    if (typeof module_options.provider === 'function') {
      providers = await module_options.provider();
    } else if (module_options.provider) {
      providers = module_options.provider;
    }
    const providerArray = providers?.map(async (val) => {
      if (isProvider(val)) {
        if (val.useClass) {
          if (val.scope && val.scope !== Scope.DEFAULT) {
            Container.logger.info(`provider：${val.provider} 的scope设置被探知，其实例化将会被延迟。`);
            const v = {
              scope: val.scope,
              useClass: val.useClass,
              provider: val.provider,
              container: container,
            } as ScopeContent;
            container.setToInstanceMap(val.provider, v);
            return v;
          }
          const instance = await Container.instanceProvider(container, val.useClass, val.provider, providers);
          Container.logger.info(`通过类名实例化provider："${val.provider}"完成`);
          return instance;
        } else if (val.useFactory) {
          if (val.scope && val.scope !== Scope.DEFAULT) {
            Container.logger.info(`provider：${val.provider} 的scope设置被探知，其实例化将会被延迟。`);
            const v = {
              scope: val.scope,
              useFactory: val.useFactory,
              provider: val.provider,
              container: container,
            } as ScopeContent;
            container.setToInstanceMap(val.provider, v);
            return v;
          }
          const instance = await val.useFactory();
          Container.setToInstanceMap(container, val.provider, instance);
          Container.logger.info(`通过工厂方法实例化provider："${val.provider}"完成`);
          return instance;
        } else if (val.useValue) {
          if (val.scope && val.scope !== Scope.DEFAULT) {
            Container.logger.info(`provider：${val.provider} 的scope设置被探知，其实例化将会被延迟。`);
            const v = {
              scope: val.scope,
              useValue: val.useValue,
              provider: val.provider,
              container: container,
            } as ScopeContent;
            container.setToInstanceMap(val.provider, v);
            return v;
          }
          Container.setToInstanceMap(container, val.provider, val.useValue);
          Container.logger.info(`通过直接赋值实例化provider："${val.provider}"完成`);
          return val.useValue;
        } else {
          Container.logger.error(`在用完整Provider类型实例化"${val.provider}"时没有使用任何use方法，清检查`);
          throw new Error(`在用完整Provider类型实例化"${val.provider}"时没有使用任何use方法，清检查`);
        }
      } else {
        const options: ProviderOptions | undefined = Reflect.getMetadata(CLASS_OPTIONS, val);
        const type = Reflect.getMetadata(CLASS_TYPE, val);
        if (type !== 'ioc:provider') {
          Container.logger.error(
            `通过直接类实例化的provider：${val.name} 未被Injectable装饰器修饰，请检查该类是否为provider！`,
          );
          throw new Error(
            `通过直接类实例化的provider：${val.name} 未被Injectable装饰器修饰，请检查该类是否为provider！`,
          );
        }
        if (options && options.scope !== Scope.DEFAULT) {
          Container.logger.info(`provider：${val.name} 的scope设置被探知，其实例化将会被延迟。`);
          const v = {
            scope: options.scope,
            useClass: val,
            provider: val.name,
            container: container,
          } as ScopeContent;
          container.setToInstanceMap(val.name, v);
          return v;
        }
        const instance = await Container.instanceProvider(container, val, val.name, providers);
        Container.logger.info(`通过直接类构造实例化provider："${val.name}"完成`);
        return instance;
      }
    });
    //等待provider实例化完成
    if (providerArray) {
      await Promise.all(providerArray);
      Container.logger.info(`模块：${container.containerName} 中所有的provider实例化完成`);
      //生命周期钩子providersInstanced触发
      this.hooker.emit('providersInstanced', container);
      if ((rootModule as any).providersInstanced) {
        await (rootModule as any).providersInstanced(container);
      }
    }
    //todo 解析provider和构造函数
    if (module_options.passProviderToChild === true) {
      await Promise.all(
        needProviderToInstanceModules.map(async (mo) => {
          const exp = await Container.buildModule(mo, mirai, container.instanceMap);
          exp[0].exportedInstance.forEach((val, key) => {
            container.setToInstanceMap(key, val);
          });
        }),
      );
    }
    if (!module_options.passProviderToChild && needProviderToInstanceModules.length > 0) {
      Container.logger.error(
        `在模组：${rootModule.name} 中有子模组需要该模组中的provider，但是该模组的passProviderToChild 选项未定义或者为false，请检查。`,
      );
      throw new Error(
        `在模组：${rootModule.name} 中有子模组需要该模组中的provider，但是该模组的passProviderToChild 选项未定义或者为false，请检查。`,
      );
    }
    //导出provider
    Container.logger.info(`模块：${rootModule.name} 将开始导出provider`);
    let exports: Array<Constructor | string> = [];
    if (typeof module_options.exports === 'function') {
      exports = await module_options.exports();
    } else if (module_options.exports) {
      exports = module_options.exports;
    }
    exports?.map((val) => {
      if (typeof val == 'string') {
        if (container.instanceMap.has(val)) {
          container.exportedInstance.set(val, container.instanceMap.get(val)!);
          Container.logger.info(`provider：${val} 已导出`);
          return;
        } else {
          Container.logger.warn(
            `provider：${val} 导出失败，未找到相应令牌的provider，可能会造成严重错误，未找到相应令牌的provider，可能会造成严重错误`,
          );
        }
      } else {
        container.instanceMap.forEach((instance, key) => {
          if (instance instanceof (val as Constructor<any>)) {
            container.exportedInstance.set(key, instance);
          }
        });
      }
    });
    Container.logger.info(`模块：${container.containerName} 导出所指定的全部provider完成`);
    //生命周期钩子providersExported触发
    this.hooker.emit('providersExported', container);
    if ((rootModule as any).providersExported) {
      await (rootModule as any).providersExported(container);
    }
    Container.logger.info(`模块：${rootModule.name}将开始实例化controller`);
    const ControllerArray = module_options.controller?.map(async (val) => {
      if ((Reflect.getMetadata(CLASS_TYPE, val) ? Reflect.getMetadata(CLASS_TYPE, val) : '') !== 'ioc:controller') {
        Container.logger.error('传入的控制器未被@Controller装饰器修饰，请检查传入的是否为控制器');
        throw Error('传入的控制器未被@Controller装饰器修饰，请检查传入的是否为控制器');
      }
      const controllerInstance = await this.instanceProvider(container, val, val.name, providers);
      Container.logger.info(`controller:${val.name}实例化完成`);
      //获得原型类
      const proto = Object.getPrototypeOf(controllerInstance);
      const getParam = Object.getOwnPropertyNames(proto!).map(async (val) => {
        if (isFunction(proto[val]) && !isConstructor(proto[val])) {
          const handlerMetadata: HandlerMetadata = Reflect.getMetadata(METHODS_TYPE, proto[val]);
          if (handlerMetadata == undefined) {
            this.logger.warn(
              `检测到未被handler修饰的控制器方法：${proto[val].name}，将不会对其进行依赖注入以及订阅等相关操作，可能会引发预料之外的错误`,
            );
            return;
          }
          const handlerContext: Handler = {
            fc: (proto as any)[val],
            this: controllerInstance,
            args: await Container.instanceParam(container, (proto as any)[val], proto, providers),
          };

          //todo 未完成
          if (handlerMetadata.event) {
            let obs = <Observable<any>>await container.getInstance('[init:data]' + handlerMetadata.event);
            if (handlerMetadata.pipes) {
              //todo 可能有更好的方法
              const p = (await Promise.all(
                handlerMetadata.pipes.map(async (val) => {
                  if (!isOperatorFunction(val)) {
                    const instance = (await container.getInstance(val.name)) as RxPipe;
                    if (instance.buildRxPipe == undefined) {
                      this.logger.error(`在handler中传入了非RxPipe类的实现：${val.name}，请检查！`);
                      throw new Error(`在handler中传入了非RxPipe类的实现：${val.name}，请检查！`);
                    }
                    return await instance.buildRxPipe();
                  }
                  return val;
                }),
              )) as OperatorFunction<any, any>[];
              obs = obs.pipe(tap(), tap(), tap(), tap(), tap(), tap(), tap(), tap(), tap(), ...p);
            }
            const methodName = (proto as any)[val].name;
            Container.logger.info(`handler：${(proto as any)[val].name} 已订阅 ${handlerMetadata.event} `);
            let count = 0;
            obs.subscribe(async (val) => {
              const flowId = ++count;
              Container.logger.info(
                `${chalk.cyanBright(`[流序号：${flowId}]`)} handler：${handlerContext.fc.name} 已开始执行`,
              );
              //如果有拦截器,存在的位置替换为val
              const argsP = handlerContext.args.map(async (instance, parameterIndex) => {
                if (isDirectInstance(instance)) {
                  return Container.transformPipeValue(
                    val,
                    container,
                    {
                      parameterIndex,
                      methodName: methodName,
                      target: proto,
                    },
                    instance.pipe,
                  );
                } else if (isScopeContent(instance) && instance.scope == Scope.MESSAGE) {
                  if (instance.useClass) {
                    return await Container.instanceProvider(
                      instance.container,
                      instance.useClass,
                      instance.provider,
                      [],
                      Scope.DEFAULT,
                      true,
                    );
                  } else if (instance.useFactory) {
                    return await instance.useFactory();
                  } else if (instance.useValue) {
                    return extend(instance.useValue, true);
                  }
                }
                //  else if (isScopeContent(instance)) {
                //   Container.logger.error(
                //     `参数：${instance.provider} 所设置为Scope.TRANSIENT，只能在构造函数中实例化，不能在方法中注入，请检查`,
                //   );
                //   throw Error(
                //     `参数：${instance.provider} 所设置为Scope.TRANSIENT，只能在构造函数中实例化，不能在方法中注入，请检查`,
                //   );
                // }
                return instance;
              });
              const args = await Promise.all(argsP);
              await handlerContext.fc.call(handlerContext.this, ...args);
              Container.logger.info(
                `${chalk.cyanBright(`[流序号：${flowId}]`)} handler：${handlerContext.fc.name} 已执行完毕`,
              );
            });
          }
          container.handlerArray.push(handlerContext);
          return handlerContext;
        } else {
          return undefined;
        }
      });
      //等待方法参数列表实例化完成
      await Promise.all(getParam);
      Container.logger.info(`模块：${container.containerName} 方法参数列表实例化完成`);
    });
    //等待控制器实例化完成
    if (ControllerArray) {
      await Promise.all(ControllerArray);
    }
    //生命周期钩子moduleConstructed触发
    //todo
    this.hooker.emit('moduleConstructed', container);
    if ((rootModule as any).moduleConstructed) {
      await (rootModule as any).moduleConstructed(container);
    }
    //保证根模块在首位
    return [container].concat(...rest);
  }
  //todo 错误处理
  public setToInstanceMap<T extends string>(key: T, obj: any, update?: boolean) {
    if (update && update == true) {
      this.instanceMap.set(key, obj);
      return this;
    }
    this.instanceMap.set(key, obj);
    return this;
  }

  private static async transformPipeValue(
    value: any,
    container: Container,
    paramInfoKey: ParamDecoratorInfo,
    pipe?: Array<Constructor | string | MitsukiPipe>,
  ) {
    let val = value;
    const m = pipe?.map(async (p) => {
      if (isMitsukiPipeInstance(p)) {
        val = await p.transform(val);
        return val;
      } else if (typeof p === 'string') {
        const pipeInstance = await container.getInstance(p);
        if (isMitsukiPipeInstance(pipeInstance)) {
          val = await pipeInstance.transform(val);
          return val;
        }
        throw new Error(
          `错误的管道类型！providerName:${p}，ParamInfo:${JSON.stringify(paramInfoKey)},模块:${
            container.containerName
          }`,
        );
      } else if (isConstructor(p)) {
        let pipeInstance;
        try {
          pipeInstance = await container.getInstance(p.name, 100);
        } catch (err) {
          this.logger.warn(
            `\n管道不存在于模块provider声明中，依赖将不会注入，请检查是否传入provider配置项中。\n如果不需要注入依赖，请使用new关键字实例化管道后再传入。\nproviderName:${
              p.name
            }，ParamInfo:${JSON.stringify(paramInfoKey)},模块:${container.containerName}`,
          );
          pipeInstance = new p();
        }
        if (isMitsukiPipeInstance(pipeInstance)) {
          val = await pipeInstance.transform(val);
          return val;
        }
        throw new Error(
          `错误的管道类型！providerName:${p}，ParamInfo:${JSON.stringify(paramInfoKey)},模块:${
            container.containerName
          }`,
        );
      }
      throw new Error(
        `管道不存在于模块声明中，请检查是否传入provider配置项中。providerName:${p}，ParamInfo:${JSON.stringify(
          paramInfoKey,
        )},模块:${container.containerName}`,
      );
    });
    if (m) {
      await Promise.all(m);
    }
    return val;
  }
  public static setGlobalHook(
    hookName: ModuleHookName,
    fnc: (container: Container) => void,
    containerName?: string,
  ): Promise<Container> {
    return new Promise((ro, rj) => {
      if (containerName) {
        this.hooker.on(hookName, (val: Container) => {
          if (val.containerName == containerName) {
            fnc(val);
            ro(val);
          }
        });
      } else {
        this.hooker.on(hookName, (val: Container) => {
          fnc(val);
          ro(val);
        });
      }
    });
  }
  public static setToGlobalInstanceMap(key: string, obj: any) {
    this.global.set(key, obj);
  }
}
