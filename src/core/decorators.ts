import { CLASS_TYPE, CONTROLLER_METADATA, methodDecoratorFunc, METHOD_TYPE, MODULES_OPTIONS, paramDecoratorFunc, PARAM_METADATA, Provider, PROVIDER_METADATA } from "./types";
import { ModuleOptions } from "./types";
import 'reflect-metadata'
import { Container } from "./ioc-container";

export const Controller = createClassDecorator(CONTROLLER_METADATA);
export const Injectable = createClassDecorator(PROVIDER_METADATA);
export const friendMsg = createMethodDecorator('friendMsg');
export const Msg = createParamDecorator('msg',(val,obj,key,index)=>{
  
})

//模块装饰器，用于将模块信息绑定在模块的元信息上
export function Module(moduleOptions?: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULES_OPTIONS, moduleOptions, target);
  };
}

//用于生成只用于添加标记的参数装饰器
export function createParamDecorator(val:string,fn?:paramDecoratorFunc){
  return ():ParameterDecorator =>
    (target,key,index) => {
      Reflect.defineMetadata(PARAM_METADATA,val,target);
      if(fn !== undefined) fn(val,target,key,index);
  }
}

//用于生成只用于添加标记的方法装饰器
export function createMethodDecorator(val: string,fnc?:methodDecoratorFunc) {
  return (): MethodDecorator => (target, name, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = function(instance:any){
      const params: any[] | undefined = Reflect.getMetadata(
        'design:paramtypes',
        target,
        name
      );
      const tobeInjected = [] as any[];
      params?.forEach((param) => {
        //首先尝试从容器中找到需要的注入的实例,如果找不到则推入undefined占位
        let instance = (Container.container?.get(param) as Provider<any>);
        if(instance !== undefined) instance = instance.instance;
        tobeInjected.push(instance);
      });
      if(fnc !== undefined) fnc(val,target,name,descriptor);
      fn.call(instance,...tobeInjected);
    }
    Reflect.defineMetadata(METHOD_TYPE,val,descriptor.value);
  };
}

//用于生成只用于添加标记的类装饰器
//todo 更改参数classType的类型
export function createClassDecorator(classType: string) {
  return (): ClassDecorator => (target) => {
    Reflect.defineMetadata(CLASS_TYPE, classType, target);
  };
}
