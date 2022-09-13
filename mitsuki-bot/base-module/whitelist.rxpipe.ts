import { Logger } from './../../package/common/logger.adapter';
import { MessageType, EventType } from 'mirai-ts';
import { OperatorFunction, tap, UnaryFunction, filter } from 'rxjs';
import { Inject, Injectable } from '../../package/core/decorator';
import { RxPipe } from '../../package/core/type/types';
import { isChatMessage, isGroupMessage } from '../../package/utils/is';

@Injectable()
export class Whitelist implements RxPipe {
  constructor(@Inject({ ProviderName: 'list' }) private readonly list: number[]) {}
  public buildRxPipe(): OperatorFunction<any, any> {
    return filter((val: MessageType.GroupMessage | EventType.MemberJoinEvent) => {
      let pass = false;
      if (val.type == 'GroupMessage') {
        this.list.forEach((v) => {
          if (val.sender.group.id == v) {
            pass = true;
          }
        });
      } else if (val.type == 'MemberJoinEvent') {
        this.list.forEach((v) => {
          if (val.member.group.id == v) {
            pass = true;
          }
        });
      } else {
        Logger.getLogger(Whitelist.name).error(`不正确的类型，默认阻挡，请检查！`);
        return false;
      }
      return pass;
    });
  }
}
