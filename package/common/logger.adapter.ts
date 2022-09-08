import chalk from 'chalk';
import winston, { format } from 'winston';
import { mitsukiLoggerFactory } from './logger.factory';
//todo 待更改
export class Logger {
  public static loggerInstanceFactory: (...args: any[]) => LoggerLike;
  //todo 返回值类型可限定
  public static getLogger(...args: any[]) {
    return this.loggerInstanceFactory ? this.loggerInstanceFactory(...args) : mitsukiLoggerFactory(...args);
  }
}

export interface LoggerLike {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}
