import { api } from '../api-setting';
import { MitsukiFactory } from '../package/core/mitsuki-factory';
import { RootModule } from './root.module';

async function boot() {
  const app = await MitsukiFactory.create(RootModule, api.apiSetting);
  await app.listen();
}

boot();
