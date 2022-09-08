import { BaseService } from './base.service';
import { Message, MessageType, Mirai } from 'mirai-ts';
import path from 'path';
import { ImgService } from '../../package/image/img.service';
import { LoggerLike } from './../../package/common/logger.adapter';
import { Logger } from './../../package/common/logger.adapter';
import { Controller, Data, Handler, Inject } from '../../package/core/decorator';
import { filter, map } from 'rxjs';

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
  @Handler(
    'GroupMessage',
    filter((val: MessageType.GroupMessage) => {
      if (val.sender.group.id == 389833083) {
        return true;
      }
      return false;
    }),
    //暂时关闭
    filter(() => false),
  )
  public async getImg(
    imgService: ImgService,
    @Inject({ ProviderName: 'ejsPath' }) pathToEjs: string,
    @Data() data: MessageType.GroupMessage,
  ) {
    const p = await imgService.getPageImgFromEjs(path.join(pathToEjs, 'test.ejs'), { data });
    await this.mirai.api.sendGroupMessage(
      [Message.Plain('图片生成测试'), Message.Image(undefined, undefined, p)],
      data.sender.group.id,
    );
  }
  // @Handler('GroupMessage')
  // public a(@Inject({ ProviderName: 'random' }) r: number) {
  //   console.log(this.random, r, this.random == r);
  // }
  // public test() {}
}
