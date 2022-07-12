import { MessageType } from 'mirai-ts';
import { Mirai, MiraiApiHttpSetting, EventType } from 'mirai-ts';
import 'reflect-metadata';
import { Constructor, msgData } from './types';
export declare class Mitsuki {
    readonly mirai: Mirai;
    constructor(mirai: Mirai);
    private setEvent;
    ready(): void;
}
export declare function MitsukiFactory(module: Constructor, miraiApiHttpSetting?: MiraiApiHttpSetting): Mitsuki;
export declare class BotGroupPermissionChangeEventData implements msgData<EventType.BotGroupPermissionChangeEvent> {
    data: EventType.BotGroupPermissionChangeEvent;
    constructor(data: EventType.BotGroupPermissionChangeEvent);
}
export declare class BotInvitedJoinGroupRequestEventData implements msgData<EventType.BotInvitedJoinGroupRequestEvent> {
    data: EventType.BotInvitedJoinGroupRequestEvent;
    constructor(data: EventType.BotInvitedJoinGroupRequestEvent);
}
export declare class BotJoinGroupEventData implements msgData<EventType.BotJoinGroupEvent> {
    data: EventType.BotJoinGroupEvent;
    constructor(data: EventType.BotJoinGroupEvent);
}
export declare class BotLeaveEventActiveData implements msgData<EventType.BotLeaveEventActive> {
    data: EventType.BotLeaveEventActive;
    constructor(data: EventType.BotLeaveEventActive);
}
export declare class BotLeaveEventKickData implements msgData<EventType.BotLeaveEventKick> {
    data: EventType.BotLeaveEventKick;
    constructor(data: EventType.BotLeaveEventKick);
}
export declare class BotMuteEventData implements msgData<EventType.BotMuteEvent> {
    data: EventType.BotMuteEvent;
    constructor(data: EventType.BotMuteEvent);
}
export declare class BotOfflineEventActiveData implements msgData<EventType.BotOfflineEventActive> {
    data: EventType.BotOfflineEventActive;
    constructor(data: EventType.BotOfflineEventActive);
}
export declare class BotOfflineEventDroppedData implements msgData<EventType.BotOfflineEventDropped> {
    data: EventType.BotOfflineEventDropped;
    constructor(data: EventType.BotOfflineEventDropped);
}
export declare class BotOfflineEventForceData implements msgData<EventType.BotOfflineEventForce> {
    data: EventType.BotOfflineEventForce;
    constructor(data: EventType.BotOfflineEventForce);
}
export declare class BotOnlineEventData implements msgData<EventType.BotOnlineEvent> {
    data: EventType.BotOnlineEvent;
    constructor(data: EventType.BotOnlineEvent);
}
export declare class BotReloginEventData implements msgData<EventType.BotReloginEvent> {
    data: EventType.BotReloginEvent;
    constructor(data: EventType.BotReloginEvent);
}
export declare class BotUnmuteEventData implements msgData<EventType.BotUnmuteEvent> {
    data: EventType.BotUnmuteEvent;
    constructor(data: EventType.BotUnmuteEvent);
}
export declare class FriendRecallEventData implements msgData<EventType.FriendRecallEvent> {
    data: EventType.FriendRecallEvent;
    constructor(data: EventType.FriendRecallEvent);
}
export declare class FriendMessageData implements msgData<MessageType.FriendMessage> {
    data: MessageType.FriendMessage;
    constructor(data: MessageType.FriendMessage);
}
export declare class GroupAllowAnonymousChatEventData implements msgData<EventType.GroupAllowAnonymousChatEvent> {
    data: EventType.GroupAllowAnonymousChatEvent;
    constructor(data: EventType.GroupAllowAnonymousChatEvent);
}
export declare class GroupAllowConfessTalkEventData implements msgData<EventType.GroupAllowConfessTalkEvent> {
    data: EventType.GroupAllowConfessTalkEvent;
    constructor(data: EventType.GroupAllowConfessTalkEvent);
}
export declare class GroupAllowMemberInviteEventData implements msgData<EventType.GroupAllowMemberInviteEvent> {
    data: EventType.GroupAllowMemberInviteEvent;
    constructor(data: EventType.GroupAllowMemberInviteEvent);
}
export declare class GroupEntranceAnnouncementChangeEventData implements msgData<EventType.GroupEntranceAnnouncementChangeEvent> {
    data: EventType.GroupEntranceAnnouncementChangeEvent;
    constructor(data: EventType.GroupEntranceAnnouncementChangeEvent);
}
export declare class GroupMuteAllEventData implements msgData<EventType.GroupMuteAllEvent> {
    data: EventType.GroupMuteAllEvent;
    constructor(data: EventType.GroupMuteAllEvent);
}
export declare class GroupNameChangeEventData implements msgData<EventType.GroupNameChangeEvent> {
    data: EventType.GroupNameChangeEvent;
    constructor(data: EventType.GroupNameChangeEvent);
}
export declare class GroupRecallEventData implements msgData<EventType.GroupRecallEvent> {
    data: EventType.GroupRecallEvent;
    constructor(data: EventType.GroupRecallEvent);
}
export declare class MemberCardChangeEventData implements msgData<EventType.MemberCardChangeEvent> {
    data: EventType.MemberCardChangeEvent;
    constructor(data: EventType.MemberCardChangeEvent);
}
export declare class MemberJoinEventData implements msgData<EventType.MemberJoinEvent> {
    data: EventType.MemberJoinEvent;
    constructor(data: EventType.MemberJoinEvent);
}
export declare class MemberJoinRequestEventData implements msgData<EventType.MemberJoinRequestEvent> {
    data: EventType.MemberJoinRequestEvent;
    constructor(data: EventType.MemberJoinRequestEvent);
}
export declare class MemberLeaveEventKickData implements msgData<EventType.MemberLeaveEventKick> {
    data: EventType.MemberLeaveEventKick;
    constructor(data: EventType.MemberLeaveEventKick);
}
export declare class MemberLeaveEventQuitData implements msgData<EventType.MemberLeaveEventQuit> {
    data: EventType.MemberLeaveEventQuit;
    constructor(data: EventType.MemberLeaveEventQuit);
}
export declare class MemberMuteEventData implements msgData<EventType.MemberMuteEvent> {
    data: EventType.MemberMuteEvent;
    constructor(data: EventType.MemberMuteEvent);
}
export declare class MemberPermissionChangeEventData implements msgData<EventType.MemberPermissionChangeEvent> {
    data: EventType.MemberPermissionChangeEvent;
    constructor(data: EventType.MemberPermissionChangeEvent);
}
export declare class MemberUnmuteEventData implements msgData<EventType.MemberUnmuteEvent> {
    data: EventType.MemberUnmuteEvent;
    constructor(data: EventType.MemberUnmuteEvent);
}
export declare class NudgeEventData implements msgData<EventType.NudgeEvent> {
    data: EventType.NudgeEvent;
    constructor(data: EventType.NudgeEvent);
}
export declare class GroupMessageData implements msgData<MessageType.GroupMessage> {
    data: MessageType.GroupMessage;
    constructor(data: MessageType.GroupMessage);
}
export declare class NewFriendRequestEventData implements msgData<EventType.NewFriendRequestEvent> {
    data: EventType.NewFriendRequestEvent;
    constructor(data: EventType.NewFriendRequestEvent);
}
