import { Constructor, Provider } from './types';
import 'reflect-metadata';
export declare class Container {
    static container?: Container;
    private map;
    constructor(testMode?: boolean);
    bind(key: string, val: Provider): this;
    bind(proto: Object, val: Provider, prefix?: string): this;
    get<T = any>(key: string): T | undefined;
    get<T = any>(key: object, prefix?: string): T | undefined;
    create(obj: Constructor, prefix: string, ...param: Object[]): void;
    getMethods(type: string): Function[];
    update<T>(newVal: Provider<T>, searchKey: string): void;
    update<T>(newVal: Provider<T>, obj: Constructor<T>, prefix?: string): void;
}
export declare function createInstance<T>(container: Container, constructor: Constructor<T>): T;
export declare function module_core(target: Object): void;
export declare function getParamInstance<T>(constructor: Constructor<T>): any[];
