import { Whitelist } from './whitelist.rxpipe';
import Mirai, { MessageType } from 'mirai-ts';
import { CommandModule } from '../../package/command/command.module';
import { ConfigModule } from './../config-module/config.module';
import { GetMsg, Injectable, Module } from '../../package/core/decorator';
import { BaseController } from './base.controller';
import { ImgModule } from '../../package/image/img.module';
import { BaseService } from './base.service';
import { CommandController } from './command.controller';
import { ModuleConstructed, Scope } from '../../package/core/type/types';
import { Option } from 'commander';
import { GenerateCommand } from './commands/generate.command';
import { Container } from '../../package/core/container';
import { InfoCommand } from './commands/info.command';
//389833083, 699603078,
@Module({
  passProviderToChild: true,
  imports: [
    ImgModule,
    ConfigModule,
    CommandModule.register({
      name: 'mitsuki',
      version: '0.9.5',
      description: 'mitsuki-core的测试示例',
      commands: [GenerateCommand, InfoCommand],
    }).inject(),
  ],
  controller: [BaseController, CommandController],
  provider: [BaseService, { provider: 'list', useValue: [775876618, 389833083, 699603078] }, Whitelist],
  exports: [BaseService],
})
export class BaseModule {}
