import { Controller } from "../core/mitsuki-core";
import { FirstService } from "./service";


@Controller()
export class FirstController {
  constructor(private readonly firstService:FirstService){}
  public helloMitsuki(){
    this.firstService.helloMitsuki()
  }
}


