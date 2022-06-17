import Mirai from "mirai-ts";
import { createParamDecorator, Injectable, Module } from "../core/decorators";
import { Controller } from "../core/decorators";
import { MitsukiFactory } from "../core/mitsuki-core";

const ResInfo = createParamDecorator('')
type ResInfo = {}

@Controller()
export class FirstController {
  constructor(private readonly firstService:FirstService){}
  public helloMitsuki(){
    this.firstService.helloMitsuki()
  }
}
@Injectable()
export class FirstService {
  constructor(private readonly mirai:Mirai){}
  public helloMitsuki(@ResInfo() info?:ResInfo){
    console.log(info)
  }
}
@Module({
  imports:[],
  controllers:[FirstController],
  providers:[FirstService]
})
export class FirstModule{}

async function setup() {
  const mitsuki = MitsukiFactory(FirstModule);
}

setup()



