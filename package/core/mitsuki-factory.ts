import { Logger } from './../common/logger.adapter';
import { Constructor, ExceptionFilter, isProvider, MitsukiOptions, Provider } from './type/types';
import { filter, fromEvent } from 'rxjs';
import { Container } from './container';
import Mirai, { MiraiApiHttpSetting } from 'mirai-ts';
import chalk from 'chalk';
import inquirer from 'inquirer';
import winston from 'winston';

export class MitsukiFactory {
  private static mirai: Mirai;
  private static app: MitsukiApplication;
  private static setEvent(eventName: string) {
    // this.app.globalInject({ provider: '[init:data]' + eventName, useValue: fromEvent(this.mirai, eventName) });
    Container.setToGlobalInstanceMap('[init:data]' + eventName, fromEvent(this.mirai, eventName));
  }
  public static async create(
    module: Constructor,
    miraiApiHttpSetting: MiraiApiHttpSetting,
    mitsukiOptions?: MitsukiOptions,
  ): Promise<MitsukiApplication> {
    this.mirai = new Mirai(miraiApiHttpSetting, {});
    if (mitsukiOptions?.logger) {
      Logger.loggerInstanceFactory = mitsukiOptions.logger;
    }
    this.app = new MitsukiApplication(module, this.mirai);
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
    Container.setToGlobalInstanceMap('[init:mirai]Mirai-core', this.mirai);
    Container.setToGlobalInstanceMap('[init:utils]logger', Logger);
    Container.setToGlobalInstanceMap('[init:utils]axios', this.mirai.axios);
    return this.app;
  }
}

export class MitsukiApplication {
  private mirai: Mirai;
  private rootModule: Constructor;
  constructor(module: Constructor, mirai: Mirai) {
    this.mirai = mirai;
    this.rootModule = module;
  }
  public async listen() {
    const mitsuki = await Container.buildModule(this.rootModule, this.mirai);
    // console.log(mitsuki);
    Container.logger.info(chalk.greenBright('MitsukiApplication 成功启动'));
    this.mirai.listen();
  }
  public async globalInject(...val: Array<Provider | Constructor>) {
    const con = Container.ContainerArray.map(async (container) => {
      const wait = val.map(async (val) => {
        if (isProvider(val)) {
          if (val.useClass) {
            const instance = await Container.instanceProvider(container, val.useClass, val.provider, []);
            return instance;
          } else if (val.useFactory) {
            const instance = await val.useFactory();
            Container.setToInstanceMap(container, val.provider, instance, true);
            return instance;
          } else if (val.useValue) {
            Container.setToInstanceMap(container, val.provider, val.useValue, true);
            return val.useValue;
          }
        } else {
          const instance = await Container.instanceProvider(container, val, val.name, []);
          return instance;
        }
      });
      return wait;
    });
    await Promise.all(con);
    return this;
  }
  //todo未完成的方法
  public addGlobalExceptionFilter(exceptionFilter: ExceptionFilter) {
    const errType = Reflect.getMetadata('errType', Object.getPrototypeOf(exceptionFilter));
    fromEvent(process, 'uncaughtException')
      .pipe(filter((val) => val instanceof errType))
      .subscribe(exceptionFilter.catch);
  }
}
