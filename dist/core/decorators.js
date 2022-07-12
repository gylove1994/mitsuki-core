"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClassDecorator = exports.createMethodDecorator = exports.createParamDecorator = exports.Module = exports.TempMessage = exports.NudgeEvent = exports.NewFriendRequestEvent = exports.MemberUnmuteEvent = exports.MemberPermissionChangeEvent = exports.MemberMuteEvent = exports.MemberLeaveEventQuit = exports.message = exports.MemberLeaveEventKick = exports.MemberJoinRequestEvent = exports.MemberJoinEvent = exports.MemberCardChangeEvent = exports.GroupRecallEvent = exports.GroupNameChangeEvent = exports.GroupMuteAllEvent = exports.GroupEntranceAnnouncementChangeEvent = exports.GroupAllowMemberInviteEvent = exports.GroupAllowConfessTalkEvent = exports.GroupAllowAnonymousChatEvent = exports.FriendRecallEvent = exports.BotUnmuteEvent = exports.BotReloginEvent = exports.BotOnlineEvent = exports.BotOfflineEventForce = exports.BotOfflineEventDropped = exports.BotOfflineEventActive = exports.BotMuteEvent = exports.BotLeaveEventKick = exports.BotLeaveEventActive = exports.BotJoinGroupEvent = exports.BotInvitedJoinGroupRequestEvent = exports.BotGroupPermissionChangeEvent = exports.GroupMessage = exports.FriendMessage = exports.Injectable = exports.Controller = void 0;
const types_1 = require("./types");
require("reflect-metadata");
const ioc_container_1 = require("./ioc-container");
//类装饰器
exports.Controller = createClassDecorator(types_1.CONTROLLER_METADATA);
exports.Injectable = createClassDecorator(types_1.PROVIDER_METADATA);
//方法参数器
exports.FriendMessage = createMethodDecorator('FriendMessage');
exports.GroupMessage = createMethodDecorator('GroupMessage');
exports.BotGroupPermissionChangeEvent = createMethodDecorator('BotGroupPermissionChangeEvent');
exports.BotInvitedJoinGroupRequestEvent = createMethodDecorator('BotInvitedJoinGroupRequestEvent');
exports.BotJoinGroupEvent = createMethodDecorator('BotJoinGroupEvent');
exports.BotLeaveEventActive = createMethodDecorator('BotLeaveEventActive');
exports.BotLeaveEventKick = createMethodDecorator('BotLeaveEventKick');
exports.BotMuteEvent = createMethodDecorator('BotMuteEvent');
exports.BotOfflineEventActive = createMethodDecorator('BotOfflineEventActive');
exports.BotOfflineEventDropped = createMethodDecorator('BotOfflineEventDropped');
exports.BotOfflineEventForce = createMethodDecorator('BotOfflineEventForce');
exports.BotOnlineEvent = createMethodDecorator('BotOnlineEvent');
exports.BotReloginEvent = createMethodDecorator('BotReloginEvent');
exports.BotUnmuteEvent = createMethodDecorator('BotUnmuteEvent');
exports.FriendRecallEvent = createMethodDecorator('FriendRecallEvent');
exports.GroupAllowAnonymousChatEvent = createMethodDecorator('GroupAllowAnonymousChatEvent');
exports.GroupAllowConfessTalkEvent = createMethodDecorator('GroupAllowConfessTalkEvent');
exports.GroupAllowMemberInviteEvent = createMethodDecorator('GroupAllowMemberInviteEvent');
exports.GroupEntranceAnnouncementChangeEvent = createMethodDecorator('GroupEntranceAnnouncementChangeEvent');
exports.GroupMuteAllEvent = createMethodDecorator('GroupMuteAllEvent');
exports.GroupNameChangeEvent = createMethodDecorator('GroupNameChangeEvent');
exports.GroupRecallEvent = createMethodDecorator('GroupRecallEvent');
exports.MemberCardChangeEvent = createMethodDecorator('MemberCardChangeEvent');
exports.MemberJoinEvent = createMethodDecorator('MemberJoinEvent');
exports.MemberJoinRequestEvent = createMethodDecorator('MemberJoinRequestEvent');
exports.MemberLeaveEventKick = createMethodDecorator('MemberLeaveEventKick');
exports.message = createMethodDecorator('message');
exports.MemberLeaveEventQuit = createMethodDecorator('MemberLeaveEventQuit');
exports.MemberMuteEvent = createMethodDecorator('MemberMuteEvent');
exports.MemberPermissionChangeEvent = createMethodDecorator('MemberPermissionChangeEvent');
exports.MemberUnmuteEvent = createMethodDecorator('MemberUnmuteEvent');
exports.NewFriendRequestEvent = createMethodDecorator('NewFriendRequestEvent');
exports.NudgeEvent = createMethodDecorator('NudgeEvent');
exports.TempMessage = createMethodDecorator('TempMessage');
//模块装饰器，用于将模块信息绑定在模块的元信息上
function Module(moduleOptions) {
    return (target) => {
        Reflect.defineMetadata(types_1.MODULES_OPTIONS, moduleOptions, target);
    };
}
exports.Module = Module;
//用于生成只用于添加标记的参数装饰器
function createParamDecorator(val, fn) {
    return () => (target, key, index) => {
        Reflect.defineMetadata(types_1.PARAM_METADATA, val, target);
        if (fn !== undefined)
            fn(val, target, key, index);
    };
}
exports.createParamDecorator = createParamDecorator;
//用于生成只用于添加标记的方法装饰器
function createMethodDecorator(val, fnc) {
    return () => (target, name, descriptor) => {
        const fn = descriptor.value;
        descriptor.value = function (instance) {
            const params = Reflect.getMetadata('design:paramtypes', target, name);
            const tobeInjected = [];
            params === null || params === void 0 ? void 0 : params.forEach((param) => {
                var _a;
                //首先尝试从容器中找到需要的注入的实例,如果找不到则推入undefined占位
                let instance = (_a = ioc_container_1.Container.container) === null || _a === void 0 ? void 0 : _a.get(param);
                if (instance !== undefined)
                    instance = instance.instance;
                tobeInjected.push(instance);
            });
            if (fnc !== undefined)
                fnc(val, target, name, descriptor);
            fn.call(instance, ...tobeInjected);
        };
        //将元信息添加到原函数
        Reflect.defineMetadata(types_1.METHOD_TYPE, val, descriptor.value);
        //将原函数添加到代理函数的信息上
        Reflect.defineMetadata(types_1.ORIGIN_METHOD, fn, descriptor.value);
    };
}
exports.createMethodDecorator = createMethodDecorator;
//用于生成只用于添加标记的类装饰器
//todo 更改参数classType的类型
function createClassDecorator(classType) {
    return () => (target) => {
        Reflect.defineMetadata(types_1.CLASS_TYPE, classType, target);
    };
}
exports.createClassDecorator = createClassDecorator;
//# sourceMappingURL=decorators.js.map