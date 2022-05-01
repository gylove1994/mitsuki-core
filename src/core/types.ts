export type ModuleOptions = {
  imports?:Constructor[],
  controllers?:Constructor[],
  providers?:Constructor[],
  modules?:Constructor[],
}

export type Methods = 'GroupMsg' | 'FriendMsg'
export type DiType = 'ioc:controller' | 'ioc:service' | 'ioc:module' | 'ioc:provider'

export type Constructor<T = any> = new (...args:any[]) => T 

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
//元信息的key
export const MODULES_OPTIONS = 'moduleOptions';
export const CLASS_TYPE = 'classType';
export const METHOD_TYPE = 'methodType';



