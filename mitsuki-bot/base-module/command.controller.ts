import { ParseResult } from './../../package/command/command.type';
import { Command, CommanderError } from 'commander';
import { Logger, LoggerLike } from '../../package/common/logger.adapter';
import { MessageType } from 'mirai-ts';
import { filter, map, Subscription, Observable } from 'rxjs';
import { Controller, Data, Handler, Inject } from '../../package/core/decorator';
import { isCommand } from '../../package/command/command.rxpipe';
import { Whitelist } from './whitelist.rxpipe';
import { ParseCommand } from '../../package/command/command.mipipe';

@Controller()
export class CommandController {
  private logger: LoggerLike = Logger.getLogger(CommandController.name);
  @Handler('GroupMessage', Whitelist, isCommand('mitsuki'))
  public async testCommand(@ParseCommand() res: ParseResult, @Data() data: MessageType.ChatMessage) {
    if (res.status == 'failure') {
      data.reply(res.error.message);
      console.log(res.error.code);
    } else if (res.status == 'unknown') {
      this.logger.error(res.error);
    }
  }
}
