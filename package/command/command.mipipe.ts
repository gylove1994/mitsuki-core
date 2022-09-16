import { createParamDecorator, createParamInterceptor, Data, Inject } from './../core/decorator';
import { ParseResult } from './command.type';
import { MessageType } from 'mirai-ts';
import { Command, CommanderError } from 'commander';
import { Observable, Subscription } from 'rxjs';
import { MitsukiPipe } from '../core/type/types';
import { Injectable } from '../core/decorator';
import { Logger, LoggerLike } from '../common/logger.adapter';

// @Injectable()
// export class GetCommandGroupPipe implements MitsukiPipe {
//   constructor(@Inject({ ProviderName: '[CommandModule]command' }) private v: any) {}
//   public transform(val: any) {
//     return this.v;
//   }
// }

// @Injectable()
// export class GetCommandOutputPipe implements MitsukiPipe {
//   constructor(@Inject({ ProviderName: '[CommandModule]output' }) private v: any) {}
//   public transform(val: any) {
//     return this.v;
//   }
// }

export const CommandGroup = createParamDecorator('[CommandModule]command');

export const CommandOutput = createParamDecorator('[CommandModule]output');

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
      if (data.commandArgs == '') {
        await this.command.parseAsync(['-h'], { from: 'user' });
      } else {
        await this.command.parseAsync(data.commandArgs.split(' '), { from: 'user' });
      }
      return { status: 'success' };
    } catch (err: any) {
      if (err instanceof CommanderError) {
        subscribe?.unsubscribe();
        if (err.code == 'commander.help' || err.code == 'commander.helpDisplayed') {
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

export const ParseCommand = () => Data(ParseCommandPipe);

export const CommandArgs = createParamInterceptor('[commandModule:commandArgs]', CommandArgsPipe);
