import { FriendMessageData, GroupMessageData } from './../core/mitsuki-core';
import { FirstService } from './first-service';
export declare class FirstController {
    private readonly firstService;
    constructor(firstService: FirstService);
    helloMitsuki(msg: FriendMessageData): Promise<void>;
    saveToTempDatabase(msg: GroupMessageData): Promise<void>;
    online(): Promise<void>;
}
