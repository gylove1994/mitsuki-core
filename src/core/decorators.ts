import { CLASS_TYPE, CONTROLLER_METADATA, methodDecoratorFunc, METHOD_TYPE, MODULES_OPTIONS, ORIGIN_METHOD, paramDecoratorFunc, PARAM_METADATA, Provider, PROVIDER_METADATA } from "./types";
import { ModuleOptions } from "./types";
import 'reflect-metadata'
import { Container } from "./ioc-container";
import { EventType, MessageType } from "mirai-ts";

//类装饰器
export const Controller = createClassDecorator(CONTROLLER_METADATA);
export const Injectable = createClassDecorator(PROVIDER_METADATA);

//方法参数器
export const FriendMessage = createMethodDecorator('FriendMessage');
export const GroupMessage = createMethodDecorator('GroupMessage');
export const BotGroupPermissionChangeEvent = createMethodDecorator('BotGroupPermissionChangeEvent');
export const BotInvitedJoinGroupRequestEvent = createMethodDecorator('BotInvitedJoinGroupRequestEvent');
export const BotJoinGroupEvent = createMethodDecorator('BotJoinGroupEvent');
export const BotLeaveEventActive = createMethodDecorator('BotLeaveEventActive');
export const BotLeaveEventKick = createMethodDecorator('BotLeaveEventKick');
export const BotMuteEvent = createMethodDecorator('BotMuteEvent');
export const BotOfflineEventActive = createMethodDecorator('BotOfflineEventActive');
export const BotOfflineEventDropped = createMethodDecorator('BotOfflineEventDropped');
export const BotOfflineEventForce = createMethodDecorator('BotOfflineEventForce');
export const BotOnlineEvent = createMethodDecorator('BotOnlineEvent');
export const BotReloginEvent = createMethodDecorator('BotReloginEvent');
export const BotUnmuteEvent = createMethodDecorator('BotUnmuteEvent');
export const FriendRecallEvent = createMethodDecorator('FriendRecallEvent');
export const GroupAllowAnonymousChatEvent = createMethodDecorator('GroupAllowAnonymousChatEvent');
export const GroupAllowConfessTalkEvent = createMethodDecorator('GroupAllowConfessTalkEvent');
export const GroupAllowMemberInviteEvent = createMethodDecorator('GroupAllowMemberInviteEvent');
export const GroupEntranceAnnouncementChangeEvent = createMethodDecorator('GroupEntranceAnnouncementChangeEvent');
export const GroupMuteAllEvent = createMethodDecorator('GroupMuteAllEvent');
export const GroupNameChangeEvent = createMethodDecorator('GroupNameChangeEvent');
export const GroupRecallEvent = createMethodDecorator('GroupRecallEvent');
export const MemberCardChangeEvent = createMethodDecorator('MemberCardChangeEvent');
export const MemberJoinEvent = createMethodDecorator('MemberJoinEvent');
export const MemberJoinRequestEvent = createMethodDecorator('MemberJoinRequestEvent');
export const MemberLeaveEventKick = createMethodDecorator('MemberLeaveEventKick');
export const message = createMethodDecorator('message');
export const MemberLeaveEventQuit = createMethodDecorator('MemberLeaveEventQuit');
export const MemberMuteEvent = createMethodDecorator('MemberMuteEvent');
export const MemberPermissionChangeEvent = createMethodDecorator('MemberPermissionChangeEvent');
export const MemberUnmuteEvent = createMethodDecorator('MemberUnmuteEvent');
export const NewFriendRequestEvent = createMethodDecorator('NewFriendRequestEvent');
export const NudgeEvent = createMethodDecorator('NudgeEvent');
export const TempMessage = createMethodDecorator('TempMessage');


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
  return (): MethodDecorator => (target, name, descriptor: PropertyDescriptor) => {
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
    //将元信息添加到原函数
    Reflect.defineMetadata(METHOD_TYPE,val,descriptor.value);
    //将原函数添加到代理函数的信息上
    Reflect.defineMetadata(ORIGIN_METHOD,fn,descriptor.value);
  };
}

//用于生成只用于添加标记的类装饰器
//todo 更改参数classType的类型
export function createClassDecorator(classType: string) {
  return (): ClassDecorator => (target) => {
    Reflect.defineMetadata(CLASS_TYPE, classType, target);
  };
}
