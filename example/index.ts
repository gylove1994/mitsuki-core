import winston from 'winston';
import { format } from 'logform';
import { Logger } from '../package/common/logger.adapter';
import { MitsukiFactory } from '../package/core/mitsuki-factory';
import { api } from './api-setting';
import { BaseModule } from './base.module';
import chalk from 'chalk';

async function boot() {
  const app = await MitsukiFactory.create(BaseModule, api.apiSetting);
  await app.listen();
}

boot();
