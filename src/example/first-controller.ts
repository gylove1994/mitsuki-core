import { FriendMessageData, GroupMessageData } from './../core/mitsuki-core';
import { FirstService } from './first-service';
import {
  BotOnlineEvent,
  Controller,
  FriendMessage,
  GroupMessage,
} from '../core/decorators';

@Controller()
export class FirstController {
  constructor(private readonly firstService: FirstService) {}
  @FriendMessage()
  public async helloMitsuki(msg: FriendMessageData) {
    await this.firstService.helloMitsuki(msg.data);
  }
  @GroupMessage()
  public async saveToTempDatabase(msg: GroupMessageData) {
    await this.firstService.saveToTempDatabase(msg.data);
  }
  @BotOnlineEvent()
  public async online() {
    console.log('bot上线啦！！！！！');
  }
}
