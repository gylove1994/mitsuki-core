import { CLASS_TYPE, CONTROLLER_METADATA, METHOD_TYPE, MODULES_OPTIONS, PROVIDER_METADATA } from "./types";
import { ModuleOptions } from "./types";

export const Controller = createClassDecorator(CONTROLLER_METADATA);
export const Injectable = createClassDecorator(PROVIDER_METADATA);

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
