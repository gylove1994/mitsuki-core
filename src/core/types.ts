export type ModuleOptions = {
  imports?:object[],
  controllers?:Constructor[],
  providers?:Constructor[],
  modules?:Constructor[],
}

export type Methods = 'GroupMsg' | 'FriendMsg'
export type DiType = 'ioc:controller' | 'ioc:service' | 'ioc:module' | 'ioc:provider'

export type Constructor<T = any> = new (...args:any[]) => T 
export type paramDecoratorFunc = (val:string,target:Object,key:string|symbol,index:number) => void
export type methodDecoratorFunc = (val:string,target:object, propertyName:string|symbol, descriptor:PropertyDescriptor) => void
export type Provider<T = any> = {
  type:string,
  instance:T
}
export type ParamType = [...arg:Constructor[]] | undefined

//元信息的value
export const CONTROLLER_METADATA = 'ioc:controller';
export const PROVIDER_METADATA = 'ioc:provider';
export const METHOD_METADATA = 'ioc:method';
export const PARAM_METADATA = 'ioc:param';
export const CONTAINER_METADATA = 'ioc:container';
export const INIT_METADATA = 'ioc:init';
export const OUTER_METADATA = 'ioc:outer_class';
//元信息的key
export const MODULES_OPTIONS = 'moduleOptions';
export const CLASS_TYPE = 'classType';
export const METHOD_TYPE = 'methodType';
export const PARAM_TYPE = 'paramType';
export const DES_PARAM_TYPE = 'design:paramtypes';



