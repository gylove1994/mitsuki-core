import path from 'path';
import fs from 'fs';
import { api } from '../../mitsuki-bot/api-setting';
import { Logger, LoggerLike } from '../common/logger.adapter';
import { EventEmitter } from 'events';
import { Injectable } from '../core/decorator';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import md5 from 'md5';

@Injectable()
export class ImgService {
  private logger: LoggerLike;
  private eventEmitter: EventEmitter;
  private isLaunch: boolean;
  private _browser?: puppeteer.Browser;
  constructor() {
    this.logger = Logger.getLogger('ImgService');
    this.eventEmitter = new EventEmitter();
    this.isLaunch = false;
    puppeteer.launch({ headless: true }).then((val) => {
      this.logger.info(`browser已成功登录`);
      this._browser = val;
      this.eventEmitter.emit('browser', val);
      this.isLaunch = true;
    });
  }
  public getBrowser(): Promise<puppeteer.Browser> {
    return new Promise((ro, rj) => {
      if (this.isLaunch && this._browser !== undefined) {
        ro(this._browser);
      } else {
        this.eventEmitter.on('browser', (val) => {
          ro(val);
        });
      }
      setTimeout(() => {
        rj('超时');
      }, api.expTime);
    });
  }
  public async getPageImgFromUrl(url: string, fileName: string) {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    const img = await page.screenshot({ path: `${path.join(__dirname)}/imgs/${fileName}.png` });
    page.close();
    return img;
  }
  public async getPageImgFromEjs<T extends ejs.Data | undefined>(filePathWithName: string, data?: T) {
    const renderedString = await ejs.renderFile(filePathWithName, data, undefined);
    const imgName = md5(renderedString);
    this.logger.info(`html文件已成功渲染在：${path.join(__dirname)}/img-templates/${imgName}.html`);
    fs.writeFileSync(`${path.join(__dirname)}/img-templates/html/${imgName}.html`, renderedString, { flag: 'w+' });
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname)}/img-templates/html/${imgName}.html`);
    const img = await page.screenshot({ path: `${path.join(__dirname)}/imgs/${imgName}.png` });
    this.logger.info(`img文件已成功保存在：${path.join(__dirname)}/imgs/${imgName}.png`);
    page.close();
    return `${path.join(__dirname)}/imgs/${imgName}.png`;
  }
}
