import { MessageType } from 'mirai-ts';
import { OperatorFunction, Observable } from 'rxjs';

export function isGroupMessage(val: any): val is MessageType.GroupMessage {
  if (val.type == 'GroupMessage') {
    return true;
  } else {
    return false;
  }
}

export function isFriendMessage(val: any): val is MessageType.FriendMessage {
  if (val.type == 'FriendMessage') {
    return true;
  } else {
    return false;
  }
}

export function isChatMessage(val: any): val is MessageType.ChatMessage {
  if (val.type == 'FriendMessage' || val.type == 'FriendMessage' || val.type == 'TempMessage') {
    return true;
  } else {
    return false;
  }
}

export function isOperatorFunction(val: any): val is OperatorFunction<any, any> {
  try {
    new Observable().pipe(val);
    return true;
  } catch (err) {
    return false;
  }
}
