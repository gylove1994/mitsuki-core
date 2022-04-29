import Mirai from "mirai-ts";
import { Injectable } from "../core/mitsuki-core";


@Injectable()
export class FirstService {
  constructor(private readonly mirai:Mirai){}
  public helloMitsuki(){
    this.mirai.api.sendFriendMessage("hello",2528611422)
  }
}