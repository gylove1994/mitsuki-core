import { ImgService } from './img.service';
import path from 'path';
import { Module } from '../core/decorator';

@Module({
  imports: [],
  provider: [
    ImgService,
    {
      provider: 'ejsPath',
      useFactory: () => path.join(__dirname, '/img-templates/ejs/'),
    },
  ],
  controller: [],
  exports: [ImgService, 'ejsPath'],
})
export class ImgModule {}
