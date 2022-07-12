"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = exports.isConstructor = exports.getMetaAndThrow = void 0;
require("reflect-metadata");
function getMetaAndThrow(metaKey, target, info) {
    const meta = Reflect.getMetadata(metaKey, target);
    if (meta == undefined)
        throw new Error('未获取到对应的的元信息\ninfo = ' +
            info +
            '\nmetaKey =' +
            metaKey +
            '\ntarget=' +
            target +
            '\n');
    return meta;
}
exports.getMetaAndThrow = getMetaAndThrow;
//判断传入的函数是不是构造函数
function isConstructor(f) {
    if (f.name === 'constructor')
        return true;
    return false;
}
exports.isConstructor = isConstructor;
//判断传入的参数是不是函数
function isFunction(f) {
    if (typeof f == 'function')
        return true;
    return false;
}
exports.isFunction = isFunction;
//# sourceMappingURL=utils.js.map