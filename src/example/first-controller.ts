import { MessageType } from 'mirai-ts';
import { FirstService } from './first-service';
import { Controller, FriendMessage, GroupMessage } from "../core/decorators";

@Controller()
export class FirstController{
  constructor(private readonly firstService:FirstService){}
  @FriendMessage()
  public async helloMitsuki(msg:MessageType.FriendMessage){
    this.firstService.helloMitsuki(msg);
  }
  @GroupMessage()
  public async saveToTempDatabase(msg:MessageType.GroupMessage){
    this.firstService.show(msg);
  }
}