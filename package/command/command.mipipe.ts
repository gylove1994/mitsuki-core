import { createParamInterceptor, Data } from './../core/decorator';
import { ParseResult } from './command.type';
import { MessageType } from 'mirai-ts';
import { Command, CommanderError } from 'commander';
import { Observable, Subscription } from 'rxjs';
import { MitsukiPipe } from '../core/type/types';
import { CommandGroup, CommandOutput } from './command.decorator';
import { Inject, Injectable } from '../core/decorator';
import { Container } from '../core/container';
import { Logger, LoggerLike } from '../common/logger.adapter';

@Injectable()
export class CommandArgsPipe implements MitsukiPipe {
  private logger: LoggerLike = Logger.getLogger('commandArgsPipe');
  public transform(val: MessageType.ChatMessage & Record<'commandArgs', string>) {
    if (val.commandArgs == undefined) {
      this.logger.error(`commandArgsPipe无法转换值，其值未经过isCommand处理！`);
      throw new Error(`commandArgsPipe无法转换值，其值未经过isCommand处理！`);
    }
    return val.commandArgs;
  }
}

@Injectable()
export class ParseCommandPipe implements MitsukiPipe {
  constructor(
    @CommandGroup() private readonly command: Command,
    @CommandOutput() private readonly output: Observable<string>,
    private readonly commandArgsPipe: CommandArgsPipe,
  ) {}
  public async transform(data: MessageType.ChatMessage & Record<'commandArgs', string>): Promise<ParseResult> {
    this.commandArgsPipe.transform(data);
    let subscribe: Subscription | undefined;
    try {
      subscribe = this.output.subscribe((val) => {
        if (val && val !== '') {
          data.reply(val);
        }
        subscribe?.unsubscribe();
      });
      this.command.hook('preAction', (thisCommand, actionCommand) => {
        Object.defineProperty(actionCommand, 'data', {
          writable: true,
          enumerable: true,
          configurable: true,
          value: data,
        });
      });
      this.command.hook('postAction', (thisCommand, actionCommand: any) => {
        if (actionCommand.data) {
          actionCommand.data = undefined;
        }
      });
      await this.command.parseAsync(data.commandArgs.split(' '), { from: 'user' });
      return { status: 'success' };
    } catch (err: any) {
      if (err instanceof CommanderError) {
        subscribe?.unsubscribe();
        if (err.code == 'commander.help') {
          return {
            status: 'success',
          };
        }
        return {
          status: 'failure',
          error: err,
        };
      }
      return {
        status: 'unknown',
        error: err,
      };
    }
  }
}
