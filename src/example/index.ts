import { PARAM_METADATA } from './../core/types';
import Mirai, { MessageType, MiraiApiHttpSetting } from "mirai-ts";
import { Controller, createMethodDecorator, createParamDecorator, friendMsg, Injectable, Module, Msg } from "../core/decorators";
import { MitsukiFactory } from "../core/mitsuki-core";
import { DES_PARAM_TYPE } from "../core/types";

class A {
  constructor(){
    this.hanya = 'a';
  }
  public hanya:string;
}
const a = new A();

@Injectable()
export class FirstService {
  constructor(private readonly mirai:Mirai){}
  public helloMitsukiSer(a:A){
    this.mirai.api.sendFriendMessage('helloworld',2528611422);
    console.log(a);
  }
}

@Controller()
export class FirstController {
  constructor(private readonly firstService:FirstService){}
  @friendMsg()
  public helloMitsuki(mirai:Mirai,a:A){
    this.firstService.helloMitsukiSer(a);
  }
}

@Module({
  imports:[a],
  controllers:[FirstController],
  providers:[FirstService],
})
export class FirstModule{}

const api:MiraiApiHttpSetting = {
  "adapters": ["http", "ws"],
  "enableVerify": false,
  "verifyKey": "1145141919",
  "debug": true,
  "singleMode": true,
  "cacheSize": 4096,
  "adapterSettings": {
    "http": {
      "port": 8081,
      "host": "localhost",
      "cors": ["*"]
    },
    "ws": {
      "port": 8080,
      "host": "localhost"
    }
  }
}

async function setup() {
  const mitsuki = MitsukiFactory(FirstModule,api);
  mitsuki.ready();
}

setup();

