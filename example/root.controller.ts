import { Controller, Handler } from '../package/core/decorator';

@Controller()
export class RootController {
  @Handler('GroupMessage')
  public async testGroupMessage() {
    console.log('helloWorld!');
  }
}
