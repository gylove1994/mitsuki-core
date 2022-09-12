import { Module } from '../package/core/decorator';
import { RootController } from './root.controller';

@Module({
  imports: [],
  controller: [RootController],
  provider: [],
  exports: [],
})
export class RootModule {}
