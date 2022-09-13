import { BaseService } from './base.service';
import { Message, MessageType, Mirai, EventType } from 'mirai-ts';
import path from 'path';
import { ImgService } from '../../package/image/img.service';
import { LoggerLike } from './../../package/common/logger.adapter';
import { Logger } from './../../package/common/logger.adapter';
import { Controller, Data, Handler, Inject } from '../../package/core/decorator';
import { filter, map } from 'rxjs';
import { Whitelist } from './whitelist.rxpipe';

@Controller()
export class BaseController {
  private logger: LoggerLike = Logger.getLogger('BaseController');
  constructor(
    @Inject({ ProviderName: '[init:mirai]Mirai-core' }) private readonly mirai: Mirai,
    private readonly baseService: BaseService, // @Inject({ ProviderName: 'random' }) private random: number,
  ) {}
  @Handler('BotOnlineEvent')
  public online() {
    this.logger.info(`mitsuki-bot已上线`);
  }
  @Handler('BotOfflineEventDropped')
  public offline() {
    this.logger.error(`mitsuki-bot已掉线`);
  }
  @Handler('MemberJoinEvent', Whitelist)
  public welcome(@Data() data: EventType.MemberJoinEvent) {
    this.mirai.api.sendGroupMessage(
      [
        Message.At(data.member.id),
        Message.Plain(`
      欢迎来到Mituki-Core框架的官方讨论QQ群
      在这里你可以获得第一手关于Mituki-Core框架的信息
      提交你对Mituki-Core框架的看法与建议
      参加Mituki-Core框架的设计与开发
      上手Mituki-Core框架的使用
      还有和开发Mituki-Core框架的沙壁开发者：gylove1994以及群友吹水（x
      使用命令：mitsuki 即可查看官方示例
      mitsuki-core的github仓库的网址为：https://github.com/gylove1994/mitsuki-core
      mitsuki-core的官方文档的网址为：https://gylove1994.github.io/mitsuki-core/
    `),
      ],
      data.member.group.id,
    );
  }
}
