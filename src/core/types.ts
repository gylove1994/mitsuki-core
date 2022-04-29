export type ModuleOptions = {
  imports?:Constructor[],
  controllers?:Constructor[],
  providers?:Constructor[],
  modules?:Constructor[],
}

export type Methods = 'GroupMsg' | 'FriendMsg'
export type DiType = 'ioc:controller' | 'ioc:service' | 'ioc:module' | 'ioc:provider'
//从 T 上获取 K 属性的类型
export type GetType<T extends Record<string,unknown>,K extends keyof T> = T extends {[p in K] : infer A} ? A : any 
export type Constructor<T = any> = new (...args:any[]) => T 

export type Provider<T> = {
  type:DiType,
  instance:T
}
export type ParamType = [...arg:Constructor[]] | undefined



