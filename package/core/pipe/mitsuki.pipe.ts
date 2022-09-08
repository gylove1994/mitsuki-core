import { Logger } from '../../common/logger.adapter';
import { GroupMassage } from '../../../example/group-massage.entity';
import { Repository } from 'typeorm';
import { MitsukiPipe } from '../type/types';
import { MessageType } from 'mirai-ts';
import { isChatMessage, isFriendMessage } from '../../utils/is';
import { Inject } from '../decorator';

// //
// export class SenderId implements MitsukiPipe {
//   constructor(@Inject({ProviderName:'[init:utils]logger'}) private logger:Logger ){}
//   public transform(val: MessageType.ChatMessage) {
//     if()
//   }
// }
