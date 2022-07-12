import { GroupMessage, BotJoinGroupEvent, BotLeaveEventActive, BotLeaveEventKick, BotMuteEvent, BotOfflineEventActive, BotOfflineEventDropped, BotOfflineEventForce, BotOnlineEvent, BotReloginEvent, BotUnmuteEvent, FriendRecallEvent, GroupAllowAnonymousChatEvent, GroupAllowConfessTalkEvent, GroupAllowMemberInviteEvent, GroupEntranceAnnouncementChangeEvent, GroupMuteAllEvent, GroupNameChangeEvent, GroupRecallEvent, MemberCardChangeEvent, MemberJoinEvent, MemberJoinRequestEvent, MemberLeaveEventKick, MemberLeaveEventQuit, MemberMuteEvent, MemberPermissionChangeEvent, MemberUnmuteEvent, NudgeEvent } from './decorators';
import  Log4js from 'log4js';
import { MessageType } from 'mirai-ts';
import path from 'path';
import fs from 'node:fs';
import md5 from 'md5';
import { Mirai, MiraiApiHttpSetting, EventType } from 'mirai-ts';
import 'reflect-metadata';
import { CLASS_TYPE, Constructor, INIT_METADATA, Provider, PARAM_TYPE, msgData } from './types';
import { Container, module_core } from './ioc-container';
Log4js.getLogger('mitsuki-core').level = 'debug'
// mitsuki 主类
//todo 未完成的类
export class Mitsuki {
  public readonly mirai: Mirai;
  constructor(mirai: Mirai) {
    this.mirai = mirai;
  }
  private setEvent<T extends "message" | keyof EventType.EventMap | MessageType.ChatMessage['type']>(eventName:T){
    const con = Container.container;
    this.mirai.on(eventName, (data)=>{
      const box = con?.get(eventName);
      if(box != undefined){
        box.data = data;
        con?.update({instance:box,type:'data'} as Provider,eventName);
      }
      const fn = con?.getMethods(eventName);
      fn?.forEach(async fn => {await fn();});
    })
  }
  public ready() {
    const con = Container.container;
    con?.create(FriendMessageData,'[data:FriendMessage]');
    con?.create(GroupMessageData,'[data:GroupMessage]');
    con?.create(BotGroupPermissionChangeEventData,'[data:BotGroupPermissionChangeEvent]');
    con?.create(BotInvitedJoinGroupRequestEventData,'[data:BotInviteGroupRequestEvent]');
    con?.create(BotJoinGroupEventData,'[data:BotJoinGroupEvent]'); 
    con?.create(BotLeaveEventActiveData,'[data:BotLeaveEventActive]');
    con?.create(BotLeaveEventKickData,'[data:BotLeaveEventKick]');
    con?.create(BotMuteEventData,'[data:BotMuteEvent]');
    con?.create(BotOfflineEventActiveData,'[data:BotOfflineEventActive]');
    con?.create(BotOfflineEventDroppedData,'[data:BotOfflineEventDropped]');
    con?.create(BotOfflineEventForceData,'[data:BotOfflineEventForce]');
    con?.create(BotOnlineEventData,'[data:BotOnlineEvent]');
    con?.create(BotReloginEventData,'[data:BotReloginEvent]');
    con?.create(BotUnmuteEventData,'[data:BotUnmuteEvent]');
    con?.create(FriendRecallEventData,'[data:FriendRecallEvent]');
    con?.create(GroupAllowAnonymousChatEventData,'[data:GroupAllowAnonymousChatEvent]');
    con?.create(GroupAllowConfessTalkEventData,'[data:GroupAllowConfessTalkEvent]');
    con?.create(GroupMuteAllEventData,'[data:GroupMuteAllEvent]');
    con?.create(GroupNameChangeEventData,'[data:GroupNameChangeEventData]');
    con?.create(GroupRecallEventData,'[data:GroupRecallEventData]');
    con?.create(MemberCardChangeEventData,'[data:MemberCardChangeEventData]');
    con?.create(MemberJoinEventData,'[data:MemberJoinEventData]');
    con?.create(MemberJoinRequestEventData,'[data:MemberJoinRequestEventData]');
    con?.create(MemberLeaveEventKickData,'[data:MemberLeaveEventKickData]');
    con?.create(MemberLeaveEventQuitData,'[data:MemberLeaveEventQuitData]');
    con?.create(MemberMuteEventData,'[data:MemberMuteEventData]');
    con?.create(MemberPermissionChangeEventData,'[data:MemberPermissionChangeEventData]');
    con?.create(MemberUnmuteEventData,'[data:MemberUnmuteEventData]');
    con?.create(NudgeEventData,'[data:NudgeEventData]');
    con?.create(NewFriendRequestEventData,'[data:NewFriendRequestEventData]');
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

export class BotGroupPermissionChangeEventData implements msgData<EventType.BotGroupPermissionChangeEvent>{
  public data:EventType.BotGroupPermissionChangeEvent;
  constructor (data:EventType.BotGroupPermissionChangeEvent){
    this.data = data;
  }
}

export class BotInvitedJoinGroupRequestEventData implements msgData<EventType.BotInvitedJoinGroupRequestEvent>{
  public data:EventType.BotInvitedJoinGroupRequestEvent;
  constructor (data:EventType.BotInvitedJoinGroupRequestEvent){
    this.data = data;
  }
}

export class BotJoinGroupEventData implements msgData<EventType.BotJoinGroupEvent> {
  public data:EventType.BotJoinGroupEvent;
  constructor(data:EventType.BotJoinGroupEvent){
    this.data = data;
  }
}

export class BotLeaveEventActiveData implements msgData<EventType.BotLeaveEventActive> {
  public data:EventType.BotLeaveEventActive;
  constructor(data:EventType.BotLeaveEventActive){
    this.data = data;
  }
}

export class BotLeaveEventKickData implements msgData<EventType.BotLeaveEventKick> {
  public data: EventType.BotLeaveEventKick;
  constructor(data:EventType.BotLeaveEventKick){
    this.data = data;
  }
} 

export class BotMuteEventData implements msgData<EventType.BotMuteEvent> {
  public data: EventType.BotMuteEvent;
  constructor(data:EventType.BotMuteEvent){
    this.data = data;
  }
}

export class BotOfflineEventActiveData implements msgData<EventType.BotOfflineEventActive> {
  public data: EventType.BotOfflineEventActive;
  constructor(data:EventType.BotOfflineEventActive){
    this.data = data;
  }
}

export class BotOfflineEventDroppedData implements msgData<EventType.BotOfflineEventDropped> {
  public data: EventType.BotOfflineEventDropped;
  constructor(data:EventType.BotOfflineEventDropped){
    this.data = data;
  }
}

export class BotOfflineEventForceData implements msgData<EventType.BotOfflineEventForce> {
  public data: EventType.BotOfflineEventForce;
  constructor(data:EventType.BotOfflineEventForce) {
    this.data = data;
  }
}

export class BotOnlineEventData implements msgData<EventType.BotOnlineEvent> {
  public data: EventType.BotOnlineEvent;
  constructor(data:EventType.BotOnlineEvent) {
    this.data = data;
  }
}

export class BotReloginEventData implements msgData<EventType.BotReloginEvent> {
  public data: EventType.BotReloginEvent;
  constructor(data:EventType.BotReloginEvent) {
    this.data = data;
  }
}

export class BotUnmuteEventData implements msgData<EventType.BotUnmuteEvent> {
  public data: EventType.BotUnmuteEvent;
  constructor(data:EventType.BotUnmuteEvent) {
    this.data = data;
  }
}

export class FriendRecallEventData implements msgData<EventType.FriendRecallEvent> {
  public data: EventType.FriendRecallEvent;
  constructor(data:EventType.FriendRecallEvent) {
    this.data = data;
  }
}

export class FriendMessageData implements msgData<MessageType.FriendMessage>{
  public data:MessageType.FriendMessage;
  constructor (data:MessageType.FriendMessage){
    this.data = data;
  }
}

export class GroupAllowAnonymousChatEventData implements msgData<EventType.GroupAllowAnonymousChatEvent> {
  public data:EventType.GroupAllowAnonymousChatEvent;
  constructor(data:EventType.GroupAllowAnonymousChatEvent) {
    this.data = data;
  }
}

export class GroupAllowConfessTalkEventData implements msgData<EventType.GroupAllowConfessTalkEvent> {
  public data:EventType.GroupAllowConfessTalkEvent;
  constructor(data:EventType.GroupAllowConfessTalkEvent){
    this.data = data;
  }
}

export class GroupAllowMemberInviteEventData implements msgData<EventType.GroupAllowMemberInviteEvent> {
  public data:EventType.GroupAllowMemberInviteEvent;
  constructor(data:EventType.GroupAllowMemberInviteEvent){
    this.data = data;
  }
}

export class GroupEntranceAnnouncementChangeEventData implements msgData<EventType.GroupEntranceAnnouncementChangeEvent> {
  public data:EventType.GroupEntranceAnnouncementChangeEvent;
  constructor(data:EventType.GroupEntranceAnnouncementChangeEvent) { 
    this.data = data;
  }
}

export class GroupMuteAllEventData implements msgData<EventType.GroupMuteAllEvent> {
  public data:EventType.GroupMuteAllEvent;
  constructor(data:EventType.GroupMuteAllEvent) {
    this.data = data;
  }
}

export class GroupNameChangeEventData implements msgData<EventType.GroupNameChangeEvent> {
  public data:EventType.GroupNameChangeEvent;
  constructor(data:EventType.GroupNameChangeEvent) {
    this.data = data;
  }
}

export class GroupRecallEventData implements msgData<EventType.GroupRecallEvent> {
  public data:EventType.GroupRecallEvent;
  constructor(data:EventType.GroupRecallEvent) {
    this.data = data;
  }
}

export class MemberCardChangeEventData implements msgData<EventType.MemberCardChangeEvent> {
  public data:EventType.MemberCardChangeEvent;
  constructor(data:EventType.MemberCardChangeEvent) {
    this.data = data;
  }
}

export class MemberJoinEventData implements msgData<EventType.MemberJoinEvent> {
  public data:EventType.MemberJoinEvent;
  constructor(data:EventType.MemberJoinEvent) {
    this.data = data;
  }
}

export class MemberJoinRequestEventData implements msgData<EventType.MemberJoinRequestEvent> {
  public data:EventType.MemberJoinRequestEvent;
  constructor(data:EventType.MemberJoinRequestEvent) {
    this.data = data;
  }
}

export class MemberLeaveEventKickData implements msgData<EventType.MemberLeaveEventKick> {
  public data:EventType.MemberLeaveEventKick;
  constructor(data:EventType.MemberLeaveEventKick) {
    this.data = data;
  }
}

export class MemberLeaveEventQuitData implements msgData<EventType.MemberLeaveEventQuit> {
  public data:EventType.MemberLeaveEventQuit;
  constructor(data:EventType.MemberLeaveEventQuit){
    this.data = data;
  }
}

export class MemberMuteEventData implements msgData<EventType.MemberMuteEvent> {
  public data:EventType.MemberMuteEvent;
  constructor(data:EventType.MemberMuteEvent) {
    this.data = data;
  }
}

export class MemberPermissionChangeEventData implements msgData<EventType.MemberPermissionChangeEvent> {
  public data:EventType.MemberPermissionChangeEvent;
  constructor(data:EventType.MemberPermissionChangeEvent) {
    this.data = data;
  }
}

export class MemberUnmuteEventData implements msgData<EventType.MemberUnmuteEvent> {
  public data:EventType.MemberUnmuteEvent;
  constructor(data:EventType.MemberUnmuteEvent){
    this.data = data;
  }
}

export class NudgeEventData implements msgData<EventType.NudgeEvent> {
  public data:EventType.NudgeEvent;
  constructor(data:EventType.NudgeEvent) {
    this.data = data;
  }
}

export class GroupMessageData implements msgData<MessageType.GroupMessage>{
  public data:MessageType.GroupMessage;
  constructor (data:MessageType.GroupMessage){
    this.data = data;
  }
}

export class NewFriendRequestEventData implements msgData<EventType.NewFriendRequestEvent> {
  public data:EventType.NewFriendRequestEvent;
  constructor(data:EventType.NewFriendRequestEvent) {
    this.data = data;
  }
}

