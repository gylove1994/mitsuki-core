"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
const decorators_1 = require("./decorators");
const ioc_container_1 = require("./ioc-container");
const types_1 = require("./types");
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
describe('装饰器的测试', () => {
    test('测试由工厂函数生成的类装饰器工厂函数,是否可以正确添加元信息', () => {
        //测试用例
        const TestDecorator = (0, decorators_1.createClassDecorator)('test');
        let Test = class Test {
        };
        Test = __decorate([
            TestDecorator()
        ], Test);
        const meta = Reflect.getMetadata(types_1.CLASS_TYPE, Test);
        //创建结果
        const res = 'test';
        //测试
        expect(res).toBe(meta);
    });
    test('测试由工厂函数生成的方法装饰器工厂函数,是否可以正确添加元信息', () => {
        //测试用例
        const TestDecorator = (0, decorators_1.createMethodDecorator)('test');
        class Test {
            hello() { }
        }
        __decorate([
            TestDecorator(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], Test.prototype, "hello", null);
        const meta = Reflect.getMetadata(types_1.METHOD_TYPE, Test.prototype.hello);
        //创建期望结果
        const res = 'test';
        //测试
        expect(res).toBe(meta);
    });
    test('测试Module装饰器是否可以正确添加元信息', () => {
        //测试用例
        let TestInject = class TestInject {
            hello() {
                return 'hello';
            }
        };
        TestInject = __decorate([
            (0, decorators_1.Injectable)()
        ], TestInject);
        let TestController = class TestController {
            constructor(testInject) {
                this.testInject = testInject;
            }
        };
        TestController = __decorate([
            (0, decorators_1.Controller)(),
            __metadata("design:paramtypes", [TestInject])
        ], TestController);
        let TestInject2 = class TestInject2 {
            constructor(testInject) {
                this.testInject = testInject;
            }
            hello() {
                return this.testInject.hello();
            }
        };
        TestInject2 = __decorate([
            (0, decorators_1.Injectable)(),
            __metadata("design:paramtypes", [TestInject])
        ], TestInject2);
        let Test = class Test {
        };
        Test = __decorate([
            (0, decorators_1.Module)({
                controllers: [TestController],
                providers: [TestInject, TestInject2],
            })
        ], Test);
        //创建预期结果
        const res = {
            providers: [TestInject, TestInject2],
            controllers: [TestController],
        };
        //测试
        const meta = Reflect.getMetadata(types_1.MODULES_OPTIONS, Test);
        expect(res).toStrictEqual(meta);
    });
});
//# sourceMappingURL=decorators.spec.js.map