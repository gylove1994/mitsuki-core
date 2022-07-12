"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewFriendRequestEventData = exports.GroupMessageData = exports.NudgeEventData = exports.MemberUnmuteEventData = exports.MemberPermissionChangeEventData = exports.MemberMuteEventData = exports.MemberLeaveEventQuitData = exports.MemberLeaveEventKickData = exports.MemberJoinRequestEventData = exports.MemberJoinEventData = exports.MemberCardChangeEventData = exports.GroupRecallEventData = exports.GroupNameChangeEventData = exports.GroupMuteAllEventData = exports.GroupEntranceAnnouncementChangeEventData = exports.GroupAllowMemberInviteEventData = exports.GroupAllowConfessTalkEventData = exports.GroupAllowAnonymousChatEventData = exports.FriendMessageData = exports.FriendRecallEventData = exports.BotUnmuteEventData = exports.BotReloginEventData = exports.BotOnlineEventData = exports.BotOfflineEventForceData = exports.BotOfflineEventDroppedData = exports.BotOfflineEventActiveData = exports.BotMuteEventData = exports.BotLeaveEventKickData = exports.BotLeaveEventActiveData = exports.BotJoinGroupEventData = exports.BotInvitedJoinGroupRequestEventData = exports.BotGroupPermissionChangeEventData = exports.MitsukiFactory = exports.Mitsuki = void 0;
const log4js_1 = __importDefault(require("log4js"));
const path_1 = __importDefault(require("path"));
const node_fs_1 = __importDefault(require("node:fs"));
const mirai_ts_1 = require("mirai-ts");
require("reflect-metadata");
const types_1 = require("./types");
const ioc_container_1 = require("./ioc-container");
log4js_1.default.getLogger('mitsuki-core').level = 'debug';
// mitsuki 主类
//todo 未完成的类
class Mitsuki {
    constructor(mirai) {
        this.mirai = mirai;
    }
    setEvent(eventName) {
        const con = ioc_container_1.Container.container;
        this.mirai.on(eventName, (data) => {
            const box = con === null || con === void 0 ? void 0 : con.get(eventName);
            if (box != undefined) {
                box.data = data;
                con === null || con === void 0 ? void 0 : con.update({ instance: box, type: 'data' }, eventName);
            }
            const fn = con === null || con === void 0 ? void 0 : con.getMethods(eventName);
            fn === null || fn === void 0 ? void 0 : fn.forEach((fn) => __awaiter(this, void 0, void 0, function* () { yield fn(); }));
        });
    }
    ready() {
        const con = ioc_container_1.Container.container;
        con === null || con === void 0 ? void 0 : con.create(FriendMessageData, '[data:FriendMessage]');
        con === null || con === void 0 ? void 0 : con.create(GroupMessageData, '[data:GroupMessage]');
        con === null || con === void 0 ? void 0 : con.create(BotGroupPermissionChangeEventData, '[data:BotGroupPermissionChangeEvent]');
        con === null || con === void 0 ? void 0 : con.create(BotInvitedJoinGroupRequestEventData, '[data:BotInviteGroupRequestEvent]');
        con === null || con === void 0 ? void 0 : con.create(BotJoinGroupEventData, '[data:BotJoinGroupEvent]');
        con === null || con === void 0 ? void 0 : con.create(BotLeaveEventActiveData, '[data:BotLeaveEventActive]');
        con === null || con === void 0 ? void 0 : con.create(BotLeaveEventKickData, '[data:BotLeaveEventKick]');
        con === null || con === void 0 ? void 0 : con.create(BotMuteEventData, '[data:BotMuteEvent]');
        con === null || con === void 0 ? void 0 : con.create(BotOfflineEventActiveData, '[data:BotOfflineEventActive]');
        con === null || con === void 0 ? void 0 : con.create(BotOfflineEventDroppedData, '[data:BotOfflineEventDropped]');
        con === null || con === void 0 ? void 0 : con.create(BotOfflineEventForceData, '[data:BotOfflineEventForce]');
        con === null || con === void 0 ? void 0 : con.create(BotOnlineEventData, '[data:BotOnlineEvent]');
        con === null || con === void 0 ? void 0 : con.create(BotReloginEventData, '[data:BotReloginEvent]');
        con === null || con === void 0 ? void 0 : con.create(BotUnmuteEventData, '[data:BotUnmuteEvent]');
        con === null || con === void 0 ? void 0 : con.create(FriendRecallEventData, '[data:FriendRecallEvent]');
        con === null || con === void 0 ? void 0 : con.create(GroupAllowAnonymousChatEventData, '[data:GroupAllowAnonymousChatEvent]');
        con === null || con === void 0 ? void 0 : con.create(GroupAllowConfessTalkEventData, '[data:GroupAllowConfessTalkEvent]');
        con === null || con === void 0 ? void 0 : con.create(GroupMuteAllEventData, '[data:GroupMuteAllEvent]');
        con === null || con === void 0 ? void 0 : con.create(GroupNameChangeEventData, '[data:GroupNameChangeEventData]');
        con === null || con === void 0 ? void 0 : con.create(GroupRecallEventData, '[data:GroupRecallEventData]');
        con === null || con === void 0 ? void 0 : con.create(MemberCardChangeEventData, '[data:MemberCardChangeEventData]');
        con === null || con === void 0 ? void 0 : con.create(MemberJoinEventData, '[data:MemberJoinEventData]');
        con === null || con === void 0 ? void 0 : con.create(MemberJoinRequestEventData, '[data:MemberJoinRequestEventData]');
        con === null || con === void 0 ? void 0 : con.create(MemberLeaveEventKickData, '[data:MemberLeaveEventKickData]');
        con === null || con === void 0 ? void 0 : con.create(MemberLeaveEventQuitData, '[data:MemberLeaveEventQuitData]');
        con === null || con === void 0 ? void 0 : con.create(MemberMuteEventData, '[data:MemberMuteEventData]');
        con === null || con === void 0 ? void 0 : con.create(MemberPermissionChangeEventData, '[data:MemberPermissionChangeEventData]');
        con === null || con === void 0 ? void 0 : con.create(MemberUnmuteEventData, '[data:MemberUnmuteEventData]');
        con === null || con === void 0 ? void 0 : con.create(NudgeEventData, '[data:NudgeEventData]');
        con === null || con === void 0 ? void 0 : con.create(NewFriendRequestEventData, '[data:NewFriendRequestEventData]');
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
exports.Mitsuki = Mitsuki;
// mitsuki主类及IoC容器的工厂函数
//todo 未完成的方法
function MitsukiFactory(module, miraiApiHttpSetting) {
    var _a;
    new ioc_container_1.Container(false);
    Reflect.defineMetadata(types_1.CLASS_TYPE, types_1.INIT_METADATA, mirai_ts_1.Mirai);
    const mirai = new mirai_ts_1.Mirai(miraiApiHttpSetting);
    (_a = ioc_container_1.Container.container) === null || _a === void 0 ? void 0 : _a.bind(mirai_ts_1.Mirai, { type: types_1.INIT_METADATA, instance: mirai }, '[class]');
    (0, ioc_container_1.module_core)(module);
    //当未传入miraiApiHttpSetting参数时自动在项目根目录下寻找
    if (miraiApiHttpSetting == undefined &&
        node_fs_1.default.existsSync(path_1.default.join(__dirname, '/miraiApiHttpSetting.json')))
        miraiApiHttpSetting = JSON.parse(node_fs_1.default.readFileSync(path_1.default.join(__dirname, '/miraiApiHttpSetting.json'), 'utf-8'));
    const mitsuki = new Mitsuki(mirai);
    return mitsuki;
}
exports.MitsukiFactory = MitsukiFactory;
class BotGroupPermissionChangeEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotGroupPermissionChangeEventData = BotGroupPermissionChangeEventData;
class BotInvitedJoinGroupRequestEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotInvitedJoinGroupRequestEventData = BotInvitedJoinGroupRequestEventData;
class BotJoinGroupEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotJoinGroupEventData = BotJoinGroupEventData;
class BotLeaveEventActiveData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotLeaveEventActiveData = BotLeaveEventActiveData;
class BotLeaveEventKickData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotLeaveEventKickData = BotLeaveEventKickData;
class BotMuteEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotMuteEventData = BotMuteEventData;
class BotOfflineEventActiveData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotOfflineEventActiveData = BotOfflineEventActiveData;
class BotOfflineEventDroppedData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotOfflineEventDroppedData = BotOfflineEventDroppedData;
class BotOfflineEventForceData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotOfflineEventForceData = BotOfflineEventForceData;
class BotOnlineEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotOnlineEventData = BotOnlineEventData;
class BotReloginEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotReloginEventData = BotReloginEventData;
class BotUnmuteEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.BotUnmuteEventData = BotUnmuteEventData;
class FriendRecallEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.FriendRecallEventData = FriendRecallEventData;
class FriendMessageData {
    constructor(data) {
        this.data = data;
    }
}
exports.FriendMessageData = FriendMessageData;
class GroupAllowAnonymousChatEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupAllowAnonymousChatEventData = GroupAllowAnonymousChatEventData;
class GroupAllowConfessTalkEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupAllowConfessTalkEventData = GroupAllowConfessTalkEventData;
class GroupAllowMemberInviteEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupAllowMemberInviteEventData = GroupAllowMemberInviteEventData;
class GroupEntranceAnnouncementChangeEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupEntranceAnnouncementChangeEventData = GroupEntranceAnnouncementChangeEventData;
class GroupMuteAllEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupMuteAllEventData = GroupMuteAllEventData;
class GroupNameChangeEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupNameChangeEventData = GroupNameChangeEventData;
class GroupRecallEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupRecallEventData = GroupRecallEventData;
class MemberCardChangeEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberCardChangeEventData = MemberCardChangeEventData;
class MemberJoinEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberJoinEventData = MemberJoinEventData;
class MemberJoinRequestEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberJoinRequestEventData = MemberJoinRequestEventData;
class MemberLeaveEventKickData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberLeaveEventKickData = MemberLeaveEventKickData;
class MemberLeaveEventQuitData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberLeaveEventQuitData = MemberLeaveEventQuitData;
class MemberMuteEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberMuteEventData = MemberMuteEventData;
class MemberPermissionChangeEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberPermissionChangeEventData = MemberPermissionChangeEventData;
class MemberUnmuteEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.MemberUnmuteEventData = MemberUnmuteEventData;
class NudgeEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.NudgeEventData = NudgeEventData;
class GroupMessageData {
    constructor(data) {
        this.data = data;
    }
}
exports.GroupMessageData = GroupMessageData;
class NewFriendRequestEventData {
    constructor(data) {
        this.data = data;
    }
}
exports.NewFriendRequestEventData = NewFriendRequestEventData;
//# sourceMappingURL=mitsuki-core.js.map