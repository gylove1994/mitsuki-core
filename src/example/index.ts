import { FirstModule } from './first-module';
import { MitsukiFactory } from "../core/mitsuki-core";
import { api } from './api-setting';


const mitsuki = MitsukiFactory(FirstModule,api.apiSetting);

mitsuki.ready();