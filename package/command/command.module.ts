import { CommandController } from '../../mitsuki-bot/base-module/command.controller';
import { Constructor, Provider } from '../core/type/types';
import { Container } from '../core/container';
import { Command, Option } from 'commander';
import { Logger } from '../common/logger.adapter';
import { EventEmitter } from 'events';
import { LoggerLike } from '../common/logger.adapter';
import { Observable, map, fromEvent } from 'rxjs';
import { DynamicModule, isConstructor } from '../core/type/types';
import { CommandInfo, CommandProvider, isCommandInfo, CommandWithData } from './command.type';
import { ParseCommandPipe } from './command.mipipe';
import { CommandArgsPipe } from './command.mipipe';

export class CommandModule {
  private static logger: LoggerLike = Logger.getLogger('CommandModule');
  private eventEmitter: EventEmitter;
  private program: Command;
  private output?: Observable<string>;
  private commandProviderArray: Constructor[];
  constructor(command?: Command) {
    this.eventEmitter = new EventEmitter();
    this.program = command ? command : new Command();
    this.commandProviderArray = [];
  }
  public static register(commandInfo: CommandInfo | Command): CommandModule {
    if (isCommandInfo(commandInfo)) {
      const command = new CommandModule();
      command.program.exitOverride();
      command.program.configureOutput({
        writeOut: (str) => {
          command.eventEmitter.emit('out', str);
          if (commandInfo.configureWriteOut) {
            commandInfo.configureWriteOut(str);
          } else {
            this.logger.info(`${str}`);
          }
        },
        writeErr: (str) => {
          this.logger.error(str.trim());
        },
      });
      command.program.name(commandInfo.name);
      if (commandInfo.version) {
        command.program.version(commandInfo.version);
      }
      if (commandInfo.description) {
        command.program.description(commandInfo.description);
      }
      if (commandInfo.options) {
        command.addOptions(...commandInfo.options);
      }
      if (commandInfo.commands) {
        command.addCommands(...commandInfo.commands);
      }
      command.output = fromEvent(command.eventEmitter, 'out') as Observable<string>;
      return command;
    } else {
      return new CommandModule(commandInfo);
    }
  }
  public addCommands(...commands: Array<Command | Constructor>) {
    const com = commands.map((val) => {
      if (isConstructor(val)) {
        this.commandProviderArray.push(val);
        return;
      }
      return val;
    });
    com.forEach((val) => {
      if (val) {
        this.program.addCommand(val);
      }
    });
    return this;
  }
  public addOptions(...options: Option[]) {
    options.forEach((val) => {
      this.program.addOption(val);
    });
    return this;
  }
  public getRowCommandAndOutput(configurationFnc: (command: Command, output?: Observable<string>) => void) {
    configurationFnc(this.program, this.output);
    return this;
  }
  public inject(instanceMap?: Map<string, object>): DynamicModule {
    const array = this.commandProviderArray;
    const program = this.program;
    return {
      name: 'CommandModule',
      provider: [
        {
          provider: '[CommandModule]command',
          useValue: this.program,
        },
        {
          provider: '[CommandModule]output',
          useValue: this.output,
        },
        ...this.commandProviderArray,
        CommandArgsPipe,
        ParseCommandPipe,
      ],
      exports: ['[CommandModule]command', '[CommandModule]output', CommandArgsPipe, ParseCommandPipe],
      async moduleConstructed(con) {
        await Promise.all(
          array.map(async (val) => {
            const instance = (await con.getInstance(val.name)) as CommandProvider;
            const command = await instance.setCommand();
            command.action(async (...args) => {
              const actionsCommand = args.pop() as CommandWithData;
              const opt = args.pop();
              await instance.action(args, opt, actionsCommand, actionsCommand.data);
            });
            command.copyInheritedSettings(program);
            program.addCommand(command);
            CommandModule.logger.info(`commandProvider：${val.name}已被接受`);
          }),
        );
      },
      providersImported(con) {
        if (instanceMap) {
          instanceMap.forEach((val, key) => {
            con.setToInstanceMap(key, val);
          });
        }
      },
    };
  }
}
