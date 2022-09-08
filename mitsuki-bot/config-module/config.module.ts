import { ConfigService } from './config.service';
import { Module } from '../../package/core/decorator';

@Module({
  exports: [ConfigService],
  provider: [ConfigService],
})
export class ConfigModule {}
