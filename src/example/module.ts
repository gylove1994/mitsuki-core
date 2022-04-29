import { Module } from "../core/mitsuki-core";
import { FirstController } from "./controller";
import { FirstService } from "./service";


@Module({
  imports:[],
  controllers:[FirstController],
  providers:[FirstService]
})
export class FirstModule{}