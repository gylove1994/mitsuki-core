import { EventType, MessageType } from "mirai-ts";
export declare type ModuleOptions = {
    imports?: object[];
    controllers?: Constructor[];
    providers?: Constructor[];
    modules?: Constructor[];
};
export declare type Methods = 'GroupMsg' | 'FriendMsg';
export declare type DiType = 'ioc:controller' | 'ioc:service' | 'ioc:module' | 'ioc:provider';
export declare type Constructor<T = any> = new (...args: any[]) => T;
export declare type paramDecoratorFunc = (val: string, target: Object, key: string | symbol, index: number) => void;
export declare type methodDecoratorFunc = (val: string, target: object, propertyName: string | symbol, descriptor: PropertyDescriptor) => void;
export declare type Provider<T = any> = {
    type: string;
    instance: T;
};
export declare type ParamType = [...arg: Constructor[]] | undefined;
export declare const CONTROLLER_METADATA = "ioc:controller";
export declare const PROVIDER_METADATA = "ioc:provider";
export declare const METHOD_METADATA = "ioc:method";
export declare const PARAM_METADATA = "ioc:param";
export declare const CONTAINER_METADATA = "ioc:container";
export declare const INIT_METADATA = "ioc:init";
export declare const OUTER_METADATA = "ioc:outer_class";
export declare const MODULES_OPTIONS = "moduleOptions";
export declare const CLASS_TYPE = "classType";
export declare const METHOD_TYPE = "methodType";
export declare const PARAM_TYPE = "paramType";
export declare const DES_PARAM_TYPE = "design:paramtypes";
export declare const ORIGIN_METHOD = "originMethod";
export declare abstract class msgData<T extends EventType.Event | MessageType.ChatMessage> {
    data: T;
    constructor(data: T);
}
