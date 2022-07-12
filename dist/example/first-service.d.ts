import { MessageType } from 'mirai-ts';
import { TempDatabase } from './temp-database';
export declare class FirstService {
    private readonly tempDatabase;
    constructor(tempDatabase: TempDatabase);
    helloMitsuki(msg: MessageType.FriendMessage): Promise<void>;
    saveToTempDatabase(msg: MessageType.GroupMessage): Promise<void>;
}
