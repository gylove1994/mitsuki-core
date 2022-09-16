import { Message, Mirai, MessageType } from 'mirai-ts';
import { Logger, LoggerLike } from './../../package/common/logger.adapter';
import { EventEmitter } from 'events';
import { fromEvent, Observable } from 'rxjs';
import { Inject, Injectable, MiraiCore } from '../../package/core/decorator';
import { program, Command } from 'commander';
import { ImgService } from '../../package/image/img.service';
import path from 'path';
import { CommandOutput } from '../../package/command/command.mipipe';

@Injectable()
export class BaseService {
  constructor(
    @Inject({ ProviderName: 'ejsPath' }) private readonly pathToEjs: string,
    private readonly imgService: ImgService,
  ) {}
  public async getImg(data: MessageType.ChatMessage) {
    const p = await this.imgService.getPageImgFromEjs(path.join(this.pathToEjs, 'test.ejs'), { data });
    data.reply([Message.Plain('图片生成测试'), Message.Image(undefined, undefined, p)]);
  }
}
