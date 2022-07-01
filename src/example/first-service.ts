import { MessageType } from 'mirai-ts';
import { Injectable } from "../core/decorators";
import { TempDatabase } from './temp-database';

@Injectable()
export class FirstService{
  constructor(private readonly tempDatabase:TempDatabase){}
  public async helloMitsuki(msg:MessageType.FriendMessage){
    this.tempDatabase.put(msg.plain);
    msg.reply('helloWorld!');
    this.tempDatabase.show();
  }
  public async show(msg:MessageType.GroupMessage){
    this.tempDatabase.put(msg.plain);
    this.tempDatabase.show();
  }
}