import { MessageType } from 'mirai-ts';
import { map, Observable } from 'rxjs';
import { Inject, Injectable, Module } from '../package/core/decorator';

@Injectable()
export class BaseService {
  // constructor(@Inject({ ProviderName: 'hello' }) private hello: number) {}
  // public base = this.hello;
}

@Injectable()
export class TempDatabase {
  constructor() {
    console.log('TempDatabase init');
    console.log('TempDatabase initFinished');
  }
  private database: string[] = [];
  public show() {
    console.log(this.database);
  }
  public put(msg: string) {
    this.database.push(msg);
  }
}

// @Injectable()
// export class Test {
//   constructor(@Inject({ ProviderName: 'temp' }) t: TempDatabase, b: BaseService, @Inject({ ProviderName: 'hello' }) h: string) {
//     console.log('Test init');
//     console.log(t, b, h);
//     console.log('Test initFinished');
//   }
// }
// @Module({
//   provider: [
//     {
//       provider: 'hello',
//       useFactory: async () => new String('hello'),
//     },
//   ],
//   exports: ['hello'],
// })
// export class TestModule {}
