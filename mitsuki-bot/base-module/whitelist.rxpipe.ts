import { MessageType } from 'mirai-ts';
import { OperatorFunction, tap, UnaryFunction, filter } from 'rxjs';
import { Inject, Injectable } from '../../package/core/decorator';
import { RxPipe } from '../../package/core/type/types';

@Injectable()
export class Whitelist implements RxPipe {
  constructor(@Inject({ ProviderName: 'list' }) private readonly list: number[]) {}
  public buildRxPipe(): OperatorFunction<any, any> {
    return filter((val: MessageType.GroupMessage) => {
      let pass = false;
      this.list.forEach((v) => {
        if (val.sender.group.id == v) {
          pass = true;
          console.log(this.list);
        }
      });
      return pass;
    });
  }
}
