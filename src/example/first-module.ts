import { FirstController } from './first-controller';
import { FirstService } from './first-service';
import { Module } from "../core/decorators";
import { api } from './api-setting';

@Module({
  imports:[api],
  controllers:[FirstController],
  providers:[FirstService],
  modules:[]
})
export class FirstModule{}
