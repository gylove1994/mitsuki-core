import { BaseService } from './base.service';
import { Controller, Data, Handler, Inject } from '../package/core/decorator';
import { MessageType } from 'mirai-ts';
import { filter } from 'rxjs';

@Controller()
export class BaseController {
  constructor(@Inject({ ProviderName: 'h' }) private hello: number, private base: BaseService) {}
  @Handler(
    'GroupMessage',
    // filter<MessageType.GroupMessage>((val) => {
    //   if (val.sender.group.id == 389833083) return true;
    //   return false;
    // }),
  )
  public async testGroupMessage(@Inject({ ProviderName: 'hello' }) hello: number) {
    console.log(hello);
  }
  @Handler(
    'FriendMessage',
    filter<MessageType.FriendMessage>((val) => {
      if (val.sender.id == 205177619) return true;
      return false;
    }),
  )
  public async testFriendMessage(@Data() data: MessageType.FriendMessage) {
    console.log(data);
  }
}
