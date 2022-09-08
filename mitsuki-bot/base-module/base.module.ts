import { Whitelist } from './whitelist.rxpipe';
import { MessageType } from 'mirai-ts';
import { CommandModule } from '../../package/command/command.module';
import { ConfigModule } from './../config-module/config.module';
import { GetMsg, Injectable, Module } from '../../package/core/decorator';
import { BaseController } from './base.controller';
import { ImgModule } from '../../package/image/img.module';
import { BaseService } from './base.service';
import { CommandController } from './command.controller';
import { HelloCommand } from './commands/hello.command';
import { Scope } from '../../package/core/type/types';
import { Option } from 'commander';

@Module({
  imports: [
    ImgModule,
    ConfigModule,
    CommandModule.register({
      name: 'mitsuki',
      version: '0.9.5',
      description: 'Maybe the best QQ-message bot framework for front-end and nodejs developer.',
      commands: [HelloCommand],
      options: [new Option('-r --role', 'Check the role in a group.')],
    }).inject(),
  ],
  controller: [BaseController, CommandController],
  provider: [BaseService, { provider: 'list', useValue: [389833083, 699603078] }, Whitelist],
  exports: [],
})
export class BaseModule {}
