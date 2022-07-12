"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamInstance = exports.module_core = exports.createInstance = exports.Container = void 0;
const md5_1 = __importDefault(require("md5"));
const types_1 = require("./types");
const utils_1 = require("./utils");
require("reflect-metadata");
const log4js_1 = __importDefault(require("log4js"));
log4js_1.default.getLogger('ioc-container').level = 'debug';
//todo 开启了测试模式，在生产模式需要关闭
class Container {
    constructor(testMode = true) {
        const logger = log4js_1.default.getLogger('ioc-container');
        if (Container.container != undefined && testMode == false)
            throw new Error('容器只能被创建一次');
        this.map = new Map();
        Container.container = this;
        logger.debug('ioc容器已创建');
    }
    bind(key, val, prefix) {
        const logger = log4js_1.default.getLogger('ioc-container');
        if (typeof key == 'string') {
            logger.debug('通过字符串模式向IoC容器中添加实例，实例id：' + key);
            this.map.set(key, val);
            return this;
        }
        else {
            logger.debug('通过md5模式向IoC容器中添加实例,实例id：' +
                prefix +
                (0, md5_1.default)(key.toString()));
            this.map.set(prefix + (0, md5_1.default)(key.toString()), val);
            return this;
        }
    }
    get(key, prefix) {
        const logger = log4js_1.default.getLogger('ioc-container');
        if (typeof key == 'string') {
            const keys = [...this.map.keys()];
            const res = keys.filter((val) => {
                return val.search(key) > 0;
            });
            if (res.length > 1)
                throw new Error('ioc容器中有多个符合该模糊匹配的内容');
            const val = this.map.get(res[0]);
            if (val == undefined) {
                logger.debug('IoC容器中未找到实例id：' +
                    (0, md5_1.default)(key.toString()) +
                    '的实例对象，IoC容器将返回undefined，可能会引发未知错误。');
                return undefined;
            }
            logger.debug('IoC容器中找到实例id：' + key + '的实例对象。');
            return val;
        }
        else if (prefix != undefined) {
            const res = this.map.get(prefix + (0, md5_1.default)(key.toString()));
            if (res == undefined) {
                logger.warn('IoC容器中未找到实例id：' +
                    prefix +
                    (0, md5_1.default)(key.toString()) +
                    '的实例对象，IoC容器将返回undefined，可能会引发未知错误。');
                return undefined;
            }
            logger.debug('IoC容器中找到实例id：' + prefix + (0, md5_1.default)(key.toString()) + '的实例对象。');
            return res;
        }
        else {
            //模糊搜索
            logger.debug('正在使用模糊匹配模式从IoC容器中获取对象，性能较差,不推荐使用。');
            const keys = [...this.map.keys()];
            const res = keys.filter((val) => {
                return val.search((0, md5_1.default)(key.toString())) > 0;
            });
            if (res.length > 1)
                throw new Error('ioc容器中有多个符合该模糊匹配的内容');
            const val = this.map.get(res[0]);
            if (val == undefined) {
                logger.debug('IoC容器中未找到实例id：' +
                    (0, md5_1.default)(key.toString()) +
                    '的实例对象，IoC容器将返回undefined，可能会引发未知错误。');
                return undefined;
            }
            logger.debug('IoC容器中找到实例id：' + res[0] + '的实例对象。');
            return val;
        }
    }
    //直接使用原型对象创建实例并保存至IoC容器中
    create(obj, prefix, ...param) {
        let params;
        if (param == undefined) {
            params = getParamInstance(obj);
        }
        else {
            params = param;
        }
        const type = Reflect.getMetadata('classType', obj);
        const instance = { type: type, instance: new obj(params) };
        this.bind(obj, instance, prefix);
    }
    //获取所有在IoC容器中指定类型的方法
    getMethods(type) {
        const logger = log4js_1.default.getLogger('ioc-container');
        const fn = [];
        this.map.forEach((value, key) => {
            if (type === value.type) {
                fn.push(value.instance);
                logger.debug(key + '已被类型：' + type + '获取。');
            }
        });
        return fn;
    }
    update(newVal, obj, prefix) {
        const logger = log4js_1.default.getLogger('ioc-container');
        let res;
        if (typeof obj === 'string') {
            const keys = [...this.map.keys()];
            res = keys.filter((val) => {
                return val.search(obj) > 0;
            });
        }
        else {
            const keys = [...this.map.keys()];
            res = keys.filter((val) => {
                return val.search((0, md5_1.default)(obj.toString())) > 0;
            });
        }
        if (res.length > 1)
            throw new Error('ioc容器中有多个符合该模糊匹配的内容');
        if (res.length === 1 && typeof obj === 'function') {
            this.map.delete(res[0]);
            this.bind(obj, newVal, prefix);
            logger.debug('更新完成');
        }
        else if (res.length === 1 && typeof obj === 'string') {
            this.map.delete(res[0]);
            this.bind(res[0], newVal);
            logger.debug('更新完成');
        }
        if (res.length === 0 && typeof obj === 'function') {
            this.bind(obj, newVal, prefix);
            logger.debug('未找到更新内容，开始直接创建');
        }
        else if (res.length === 0 && typeof obj === 'string') {
            logger.debug('未找到所指定的更新内容' + '，将不会对内容进行更新，可能会引发未知错误。');
        }
    }
}
exports.Container = Container;
//用于递归创建依赖实例，并将依赖项的实例存入IoC容器中
function createInstance(container, constructor) {
    const logger = log4js_1.default.getLogger('ioc-container');
    logger.debug('正在构造名为：' + constructor.name + '的依赖实例。');
    const type = (0, utils_1.getMetaAndThrow)(types_1.CLASS_TYPE, constructor);
    const tobeInjected = getParamInstance(constructor);
    const provider = {
        type,
        instance: new constructor(...tobeInjected),
    };
    container.bind(constructor, provider, '[class]');
    logger.debug('构造结束。');
    return provider.instance;
}
exports.createInstance = createInstance;
//通过模组递归创建依赖实例
function module_core(target) {
    var _a, _b, _c, _d;
    const logger = log4js_1.default.getLogger('ioc-container');
    const container = Container.container;
    const moduleOptions = (0, utils_1.getMetaAndThrow)(types_1.MODULES_OPTIONS, target);
    if (container == undefined)
        throw new Error('IoC容器未创建');
    if (moduleOptions != undefined) {
        (_a = moduleOptions.imports) === null || _a === void 0 ? void 0 : _a.forEach((dependency) => {
            const val = { type: types_1.OUTER_METADATA, instance: dependency };
            container.bind(Object.getPrototypeOf(dependency).constructor, val, '[class]');
        });
        (_b = moduleOptions.providers) === null || _b === void 0 ? void 0 : _b.forEach((dependency) => {
            createInstance(container, dependency);
        });
        (_c = moduleOptions.controllers) === null || _c === void 0 ? void 0 : _c.forEach((dependency) => {
            const instance = createInstance(container, dependency);
            //将有方法装饰器装饰的函数放入IoC容器，其名字前会加入前缀[method]
            const p = Object.getPrototypeOf(instance);
            const methodsNames = Object.getOwnPropertyNames(p).filter((item) => !(0, utils_1.isConstructor)(p[item]) && (0, utils_1.isFunction)(p[item]));
            methodsNames.forEach((methodsName) => {
                const fn = p[methodsName];
                //todo 可能的错误
                // const tobeInjected = getParamInstance(fn);
                // console.log(tobeInjected);
                const meta = Reflect.getMetadata(types_1.METHOD_TYPE, fn);
                //调用闭包
                //todo 改用async/await实现(未验证)
                function fnToCall() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield fn(instance);
                    });
                }
                if (meta != undefined) {
                    container.bind(Reflect.getMetadata(types_1.ORIGIN_METHOD, fn), {
                        type: meta,
                        instance: fnToCall,
                    }, '[method]');
                    logger.info('方法名：' +
                        methodsName +
                        '方法类型：' +
                        meta +
                        ' 已被IoC容器接受。');
                }
            });
        });
        (_d = moduleOptions.modules) === null || _d === void 0 ? void 0 : _d.forEach((module) => {
            module_core(module);
        });
    }
}
exports.module_core = module_core;
//实例化方法参数列表
function getParamInstance(constructor) {
    const logger = log4js_1.default.getLogger('ioc-container');
    logger.debug('正在实例化方法' + constructor.name + '的参数列表');
    const container = Container.container;
    if (container == undefined)
        throw new Error('IoC容器未创建');
    const param = Reflect.getMetadata('design:paramtypes', constructor);
    if (param === undefined) {
        logger.debug('参数列表为空！');
        return [];
    }
    const tobeInjected = [];
    param === null || param === void 0 ? void 0 : param.forEach((dependency) => {
        //首先尝试从容器中找到需要的注入的实例
        const instance = container.get(dependency);
        if (instance != undefined) {
            logger.debug('所需的参数' + dependency.name + '已存在于IoC容器中，将不会重复创建。');
            tobeInjected.push(instance.instance);
            return;
        }
        else {
            //如果容器中没有，则递归创建
            logger.debug('所需的参数' + dependency.name + '不在IoC容器中，将自动递归创建。');
            tobeInjected.push(createInstance(container, dependency));
        }
        logger.debug('参数构造完毕');
    });
    return tobeInjected;
}
exports.getParamInstance = getParamInstance;
//# sourceMappingURL=ioc-container.js.map