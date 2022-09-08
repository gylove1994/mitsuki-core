import { Mirai } from 'mirai-ts';
import { Logger, LoggerLike } from './../../package/common/logger.adapter';
import { EventEmitter } from 'events';
import { fromEvent, Observable } from 'rxjs';
import { Injectable, MiraiCore } from '../../package/core/decorator';
import { program, Command } from 'commander';

@Injectable()
export class BaseService {}
