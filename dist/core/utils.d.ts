import 'reflect-metadata';
export declare function getMetaAndThrow<T = any>(metaKey: string, target: Object, info?: string): T;
export declare function getMetaAndThrow<T = any>(metaKey: Symbol, target: Object, info?: string): T;
export declare function isConstructor(f: Function): boolean;
export declare function isFunction(f: any): boolean;
