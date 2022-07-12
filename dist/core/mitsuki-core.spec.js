"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mirai_ts_1 = require("mirai-ts");
const decorators_1 = require("./decorators");
const ioc_container_1 = require("./ioc-container");
const mitsuki_core_1 = require("./mitsuki-core");
const log4js_1 = __importDefault(require("log4js"));
require("reflect-metadata");
beforeEach(() => {
    const logger = log4js_1.default.getLogger('test');
    logger.level = 'debug';
    //恢复IoC容器的初始状态
    ioc_container_1.Container.container = undefined;
    logger.info('单元测试开始');
});
afterEach(() => {
    const logger = log4js_1.default.getLogger('test');
    logger.info('单元测试结束');
});
describe('Mitsuki主类的测试', () => {
    (0, globals_1.test)('Mitsuki实例的创建', () => {
        //测试
        expect(new mitsuki_core_1.Mitsuki(new mirai_ts_1.Mirai())).toBeDefined();
    });
    (0, globals_1.test)('Mitsuki工厂创建时IoC容器是否成功创建', () => {
        //创建测试用例
        let Test = class Test {
        };
        Test = __decorate([
            (0, decorators_1.Module)({})
        ], Test);
        (0, mitsuki_core_1.MitsukiFactory)(Test);
        //测试
        expect(ioc_container_1.Container.container).toBeDefined();
    });
});
//# sourceMappingURL=mitsuki-core.spec.js.map