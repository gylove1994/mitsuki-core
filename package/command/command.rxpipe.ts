import { MessageType } from 'mirai-ts';
import { filter, map, pipe } from 'rxjs';

export const commandArgs = 'commandArgs';
export function isCommand(trigger: string) {
  return pipe(
    filter((val: MessageType.ChatMessage) => {
      if (val.plain.split(' ')[0] == trigger) {
        return true;
      }
      return false;
    }),
    map((val: MessageType.ChatMessage) => {
      const arg = val.plain.slice(val.plain.indexOf(trigger) + trigger.length).trim();
      Object.defineProperty(val, commandArgs, {
        writable: false,
        enumerable: true,
        value: arg,
        configurable: false,
      });
      return val;
    }),
  );
}
