import { Observable } from 'rxjs';
import { Command, Option } from 'commander';
import Mirai, { MessageType } from 'mirai-ts';
import { CommandProvider, CommandWithData } from '../../../package/command/command.type';
import { Injectable, GetMsg, MiraiCore } from '../../../package/core/decorator';

@Injectable()
export class HelloCommand implements CommandProvider {
  constructor() {}
  public action(
    args: string[],
    opts: Record<string, any>,
    actionCommand: Command,
    data: MessageType.ChatMessage,
  ): void | Promise<void> {
    let time = parseInt(args[1]);
    while (time--) {
      data.reply(`${opts.byMitsuki ? 'mitsuki: ' : ''}${args[0]}`);
    }
  }
  public setCommand(): Command {
    const com = new Command('hello')
      .argument('<string>', 'The words will say to you.')
      .argument('<times>', 'Say how many times to you.')
      .option('-b --byMitsuki', 'Add title which said by mitsuki.');
    com.description('Say hello to you.');
    return com;
  }
}
