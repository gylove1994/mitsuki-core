import { MessageType } from 'mirai-ts';
import { Injectable } from "../core/decorators";
import { TempDatabase } from './temp-database';

@Injectable()
export class FirstService{
  constructor(private readonly tempDatabase:TempDatabase){}
  public async helloMitsuki(msg:MessageType.FriendMessage){
    msg.reply('helloWorld!');
  }
  public async saveToTempDatabase(msg:MessageType.GroupMessage){
    this.tempDatabase.put(msg.plain);
    this.tempDatabase.show();
  }
}