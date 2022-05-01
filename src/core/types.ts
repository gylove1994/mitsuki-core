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



