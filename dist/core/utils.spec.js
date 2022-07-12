"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
require("reflect-metadata");
describe('工具函数的测试', () => {
    test('测试getMetaAndThrow函数是否可以获得元信息', () => {
        //创建待测试案例
        class Test {
        }
        Reflect.defineMetadata('test', 'test', Test);
        const meta = Reflect.getMetadata('test', Test);
        //创建期望结果
        const res = 'test';
        //测试
        expect(res).toBe(meta);
    });
    test('测试getMetaAndThrow函数是否可以正常抛出异常', () => {
        //创建待测试案例
        class Test {
        }
        //测试
        expect(() => (0, utils_1.getMetaAndThrow)('test', Test)).toThrowError();
    });
    test('测试isConstructor函数是否可以正常识别构造函数', () => {
        //创建测试案例
        class Test {
            constructor() { }
            test() { }
        }
        const p = Object.getPrototypeOf(Test);
        //测试
        expect((0, utils_1.isConstructor)(p['constructor'])).toBeTruthy();
        expect((0, utils_1.isConstructor)(p['test'])).toBeFalsy();
    });
    test('测试isFunction函数是否可以正常识别构造函数', () => {
        //创建测试案例
        class Test {
            constructor() { }
            test() { }
        }
        const p = Object.getPrototypeOf(Test);
        //测试
        expect((0, utils_1.isFunction)(p['constructor'])).toBeTruthy();
        expect((0, utils_1.isFunction)('A')).toBeFalsy();
    });
});
//# sourceMappingURL=utils.spec.js.map