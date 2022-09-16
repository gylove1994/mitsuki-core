import { MessageType } from 'mirai-ts';
import { Command, CommanderError, Option } from 'commander';
import { Constructor } from '../core/type/types';
export abstract class CommandProvider {
  public setCommand(): Command | Promise<Command> {
    return new Command();
  }
  public action(
    args: Array<string>,
    opts: Option[],
    actionCommand: Command,
    data: MessageType.ChatMessage,
  ): void | Promise<void> {}
}
export function isCommandInfo(val: any): val is CommandInfo {
  if (typeof val.name == 'string') {
    return true;
  }
  return false;
}

export type CommandInfo = {
  name: string;
  version?: string;
  description?: string;
  rootCommand?: Command;
  commands?: Array<Command | Constructor>;
  options?: Array<Option>;
  configureWriteOut?: (str: string) => void;
};

export type CommandWithData<T extends MessageType.ChatMessage = MessageType.ChatMessage> = Command & Record<'data', T>;

export type ParseStatus = 'success' | 'failure' | 'unknown';

export type ParseResult<T extends ParseStatus = ParseStatus> = T extends 'success'
  ? { status: T }
  : T extends 'failure'
  ? { status: T; error: CommanderError }
  : T extends 'unknown'
  ? { status: T; error: Error }
  : never;
