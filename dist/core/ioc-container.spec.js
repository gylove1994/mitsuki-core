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
const mirai_ts_1 = __importDefault(require("mirai-ts"));
const decorators_1 = require("./decorators");
const ioc_container_1 = require("./ioc-container");
const mitsuki_core_1 = require("./mitsuki-core");
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
describe('IoC容器的测试', () => {
    //公共测试用例-------------------------------------
    const testMethodDecorator = (0, decorators_1.createMethodDecorator)('test');
    let TestInject = class TestInject {
        hello() {
            return 'hello';
        }
        hello2() {
            return 'hello2';
        }
        hello3() { return 'hello3'; }
    };
    TestInject = __decorate([
        (0, decorators_1.Injectable)()
    ], TestInject);
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
    let TestController = class TestController {
        constructor(testInject) {
            this.testInject = testInject;
        }
    };
    TestController = __decorate([
        (0, decorators_1.Controller)(),
        __metadata("design:paramtypes", [TestInject])
    ], TestController);
    let TestController2 = class TestController2 {
        constructor(testInject) {
            this.testInject = testInject;
        }
        hello() {
            return this.testInject.hello();
        }
        hello2() {
            return this.testInject.hello2();
        }
        hello3() { return this.testInject.hello3(); }
    };
    __decorate([
        testMethodDecorator(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TestController2.prototype, "hello", null);
    __decorate([
        testMethodDecorator(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TestController2.prototype, "hello2", null);
    TestController2 = __decorate([
        (0, decorators_1.Controller)(),
        __metadata("design:paramtypes", [TestInject])
    ], TestController2);
    let TestController3 = class TestController3 {
        constructor(mirai) {
            this.mirai = mirai;
        }
    };
    TestController3 = __decorate([
        (0, decorators_1.Controller)(),
        __metadata("design:paramtypes", [mirai_ts_1.default])
    ], TestController3);
    let TestModule3 = class TestModule3 {
    };
    TestModule3 = __decorate([
        (0, decorators_1.Module)({
            providers: [TestInject],
            controllers: [TestController2],
        })
    ], TestModule3);
    let TestModule2 = class TestModule2 {
    };
    TestModule2 = __decorate([
        (0, decorators_1.Module)({
            imports: [],
            controllers: [],
            providers: [TestInject],
            modules: [],
        })
    ], TestModule2);
    let TestModule = class TestModule {
    };
    TestModule = __decorate([
        (0, decorators_1.Module)({
            imports: [],
            controllers: [TestController],
            providers: [TestInject2],
            modules: [TestModule2],
        })
    ], TestModule);
    let TestModule4 = class TestModule4 {
    };
    TestModule4 = __decorate([
        (0, decorators_1.Module)({
            controllers: [TestController3],
        })
    ], TestModule4);
    //----------------------------------------------
    test('测试createInstance是否可以实例化依赖并自动注入', () => {
        //创建待测试案例
        const container = new ioc_container_1.Container();
        (0, ioc_container_1.createInstance)(container, TestInject2);
        //创建期望结果
        const res = new ioc_container_1.Container().bind(TestInject, {
            type: 'ioc:provider',
            instance: new TestInject(),
        }, '[class]');
        res.bind(TestInject2, {
            type: 'ioc:provider',
            instance: new TestInject2(res.get(TestInject, '[class]').instance),
        }, '[class]');
        //测试
        expect(container).toStrictEqual(res);
    });
    test('测试对依赖项的访问', () => {
        //创建待测试案例
        const container = new ioc_container_1.Container();
        (0, ioc_container_1.createInstance)(container, TestInject2);
        //测试
        expect(container.get(TestInject2, '[class]').instance.hello()).toBe('hello');
    });
    test('测试依赖项不会被重复创建', () => {
        //创建待测试案例
        const container = new ioc_container_1.Container();
        (0, ioc_container_1.createInstance)(container, TestInject);
        (0, ioc_container_1.createInstance)(container, TestInject2);
        //创建期望结果
        const res = new ioc_container_1.Container().bind(TestInject, {
            type: 'ioc:provider',
            instance: new TestInject(),
        }, '[class]');
        res.bind(TestInject2, {
            type: 'ioc:provider',
            instance: new TestInject2(res.get(TestInject, '[class]').instance),
        }, '[class]');
        //测试
        expect(res).toStrictEqual(container);
    });
    test('通过模块实现依赖实例的递归创建', () => {
        //创建待测试案例
        const con = new ioc_container_1.Container();
        (0, ioc_container_1.module_core)(TestModule);
        //创建期望结果
        const res = new ioc_container_1.Container().bind(TestInject, {
            type: 'ioc:provider',
            instance: new TestInject(),
        }, '[class]');
        res.bind(TestInject2, {
            type: 'ioc:provider',
            instance: new TestInject2(res.get(TestInject, '[class]').instance),
        }, '[class]');
        res.bind(TestController, {
            type: 'ioc:controller',
            instance: new TestController(res.get(TestInject, '[class]').instance),
        }, '[class]');
        //结果
        expect(res).toStrictEqual(con);
    });
    test('当IoC容器未创建,通过模块实现依赖实例的递归创建时是否会抛出异常', () => {
        //测试
        expect(() => (0, ioc_container_1.module_core)(TestModule)).toThrowError();
    });
    test('测试普通注入', () => {
        //创建测试案例
        const con = new ioc_container_1.Container();
        let Test = class Test {
        };
        Test = __decorate([
            (0, decorators_1.Module)({
                imports: [TestInject, TestInject2],
            })
        ], Test);
        (0, ioc_container_1.module_core)(Test);
        //创建期望结果
        const res = new ioc_container_1.Container().bind(TestInject, {
            type: 'ioc:provider',
            instance: new TestInject(),
        }, '[class]');
        res.bind(TestInject2, {
            type: 'ioc:provider',
            instance: new TestInject2(res.get(TestInject, '[class]').instance),
        }, '[class]');
        //测试
        expect(res).toStrictEqual(con);
    });
    test('测试提取控制器中被方法装饰器装饰的方法', () => {
        //创建待测试案例
        const con = new ioc_container_1.Container();
        (0, ioc_container_1.module_core)(TestModule3);
        //测试
        expect('hello').toBe(con.getMethods('test')[0]());
    });
    test('测试对于方法参数的实例对象已在IoC容器中时，不会重复创建', () => {
        expect(() => (0, mitsuki_core_1.MitsukiFactory)(TestModule4)).not.toThrowError();
    });
    test('容器在生产模式下创建多次是否会抛出异常', () => {
        //创建测试用例
        function toBeTested() {
            new ioc_container_1.Container(false);
            new ioc_container_1.Container(false);
        }
        //测试
        expect(() => toBeTested()).toThrowError();
    });
    test('容器在使用md5产生摘要信息后是否可以正常读取', () => {
        //创建测试用例
        new ioc_container_1.Container();
        const con = ioc_container_1.Container.container;
        class Test {
        }
        con === null || con === void 0 ? void 0 : con.bind(Test, { type: 'a', instance: new Test() }, '[class]');
        //测试
        expect(con === null || con === void 0 ? void 0 : con.get(Test, '[class]')).toBeDefined();
    });
    test('create接口函数的使用', () => {
        //创建测试用例
        new ioc_container_1.Container();
        const con = ioc_container_1.Container.container;
        con === null || con === void 0 ? void 0 : con.create(TestController2, '[class]');
        expect(con === null || con === void 0 ? void 0 : con.get(TestController2, '[class]')).toBeDefined();
    });
    test('提取方法组', () => {
        const con = new ioc_container_1.Container();
        (0, ioc_container_1.module_core)(TestModule3);
        expect(con.getMethods('test')).toBeDefined();
    });
});
//# sourceMappingURL=ioc-container.spec.js.map