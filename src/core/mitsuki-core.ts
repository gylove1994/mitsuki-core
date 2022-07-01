import { MessageType } from 'mirai-ts';
import path from 'path';
import fs from 'node:fs';
import md5 from 'md5';
import { Mirai, MiraiApiHttpSetting, EventType } from 'mirai-ts';
import 'reflect-metadata';
import { CLASS_TYPE, Constructor, INIT_METADATA, Provider, PARAM_TYPE } from './types';
import { Container, module_core } from './ioc-container';

// mitsuki 主类
//todo 未完成的类
export class Mitsuki {
  public readonly mirai: Mirai;
  constructor(mirai: Mirai) {
    this.mirai = mirai;
  }
  private setEvent<T extends "message" | keyof EventType.EventMap | MessageType.ChatMessage['type']>(eventName:T){
    const con = Container.container;
    this.mirai.on(eventName,(data)=>{
      con?.update(Object.getPrototypeOf(data).constructor,{type:PARAM_TYPE,instance:data},'[data]');
      const fn = con?.getMethods(eventName);
      fn?.forEach(async fn => await fn());
    })
  }
  public ready() {
    this.setEvent('BotGroupPermissionChangeEvent');
    this.setEvent('BotInvitedJoinGroupRequestEvent');
    this.setEvent('BotJoinGroupEvent');
    this.setEvent('BotLeaveEventActive');
    this.setEvent('BotLeaveEventKick');
    this.setEvent('BotMuteEvent');
    this.setEvent('BotOfflineEventActive');
    this.setEvent('BotOfflineEventDropped');
    this.setEvent('BotOfflineEventForce');
    this.setEvent('BotOnlineEvent');
    this.setEvent('BotReloginEvent');
    this.setEvent('BotUnmuteEvent');
    this.setEvent('FriendMessage');
    this.setEvent('FriendRecallEvent');
    this.setEvent('GroupAllowAnonymousChatEvent');
    this.setEvent('GroupAllowConfessTalkEvent');
    this.setEvent('GroupMessage');
    this.setEvent('GroupMuteAllEvent');
    this.setEvent('GroupNameChangeEvent');
    this.setEvent('GroupRecallEvent');
    this.setEvent('MemberCardChangeEvent');
    this.setEvent('MemberJoinEvent');
    this.setEvent('MemberJoinRequestEvent');
    this.setEvent('MemberLeaveEventKick');
    this.setEvent('MemberLeaveEventQuit');
    this.setEvent('MemberMuteEvent');
    this.setEvent('MemberPermissionChangeEvent');
    this.setEvent('MemberSpecialTitleChangeEvent');
    this.setEvent('MemberUnmuteEvent');
    this.setEvent('NewFriendRequestEvent');
    this.setEvent('NudgeEvent');
    this.setEvent('message');
    this.mirai.listen();
  }
}

// mitsuki主类及IoC容器的工厂函数
//todo 未完成的方法
export function MitsukiFactory(
  module: Constructor,
  miraiApiHttpSetting?: MiraiApiHttpSetting
) {
  new Container(false);
  Reflect.defineMetadata(CLASS_TYPE, INIT_METADATA, Mirai);
  const mirai = new Mirai(miraiApiHttpSetting);
  Container.container?.bind(
    Mirai,
    { type: INIT_METADATA, instance: mirai },
    '[class]',
  );
  module_core(module);
  //当未传入miraiApiHttpSetting参数时自动在项目根目录下寻找
  if (
    miraiApiHttpSetting == undefined &&
    fs.existsSync(path.join(__dirname, '/miraiApiHttpSetting.json'))
  )
    miraiApiHttpSetting = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '/miraiApiHttpSetting.json'),
        'utf-8',
      ),
    );
  const mitsuki = new Mitsuki(mirai);
  return mitsuki;
}
