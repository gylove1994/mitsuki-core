import { Container } from './../package/core/container';
import { api } from './api-setting';
import { MitsukiFactory } from '../package/core/mitsuki-factory';
import { BaseModule } from './base-module/base.module';

async function boot() {
  // Container.setGlobalHook('moduleConstructed', (c) => console.log(c));
  const app = await MitsukiFactory.create(BaseModule, api.apiSetting);
  await app.listen();
}

boot();
