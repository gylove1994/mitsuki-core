# 快速上手

## 什么是Mitsuki-Core

本主题会帮你了解 Mitsuki-Core：什么是 Mitsuki-Core？它有哪些优势？当构建应用时它能为你提供什么帮助？

Mitsuki-Core 是一个基于 TypeScript 构建的开发平台。它包括：

  - 一个基于组件的框架，用于构建可伸缩的QQ机器人应用

  - 一组完美集成的库，涵盖各种功能，数据库、图片生成、命令模式等

  - 一套开发工具，可帮助你开发、构建、测试和更新代码

借助 Mitsuki-Core，无论个人开发还是团队开发，你都能获得平台带来的优势。Mitsuki-Core 的设计目标之一就是通过设计一个合理的、好用的框架来带动和构建一个以js/ts开发QQ机器人的社区。

因为我们深知，成千上万的node库将会给开发QQ机器人带来无比的便利。

::: tip
要试用包含本指南中代码片段的可工作范例，请查看Mitsuki-Bot实例。
:::

## Mitsuki-Core 应用：知识要点

本节会解释 Mitsuki-Core 背后的核心思想。了解这些思想可以帮助你更有效地设计和构建应用。

### 模块

模块是一个用`@Module()`装饰器注解的类。`@Module()`装饰器提供了**mitsuki**用来组织qq机器人结构的元数据。

![Modules_1](https://s2.loli.net/2022/07/02/2BMqDvHcTesywk8.png)

​		每个由mitsuki构建的qq机器人至少有一个模块，即**根模块**。**根模块是 mitsuki 用来构建整个应用**的起点——mitsuki用来解决模块（module）和提供者（provider）关系和依赖关系的内部数据结构。虽然理论上非常小的qq机器人可能只有根模块（如同示例一样），但这不是常见的情况。我**强烈**建议将模块作为组织代码的有效方式。因此，对于大多数qq机器人，最终的架构将采用多个模块，每个模块都封装了一组密切相关的**功能**。功能模块只是用于组织与特定功能相关的一系列代码，这样做可以使代码变得井井有条的同时建立清晰的边界。尤其是随着应用程序变得越来越大和复杂时，这有助于管理复杂性并使用[SOLID](https://en.wikipedia.org/wiki/SOLID)原则进行开发。

#### 示例（base.module.ts） 
``` typescript
@Module({
  imports: [TestModule],
  controller: [BaseController],
  provider: [],
  exports: [],
})
export class BaseModule {}
```
### 控制器

控制器负责处理**事件**并做出相对应的处理。

![Controllers_1](https://docs.nestjs.com/assets/Controllers_1.png)

​		控制器的目的是负责处理**事件**并对事件做出相对应的处理。为了创建一个基本的控制器，我们使用类和**装饰器**。装饰器将类与所需的元数据相关联，并使mitsuki能将对应的处理映射到与之对应的控制器中。

​		在下面的示例中，我们将使用`@Controller()`与`@Handler()`装饰器，它是定义基本控制器所**必需的。**

#### 示例（base.controller.ts）

```typescript
@Controller()
export class BaseController {
  constructor() {}
  @Handler('GroupMessage')
  public async test() {
    console.log('ControllerWorks!');
  }
}
```

### 提供者

​		**提供者**是mitsuki的一个基本概念。许多基本的类是提供一个服务或者一个功能的类——服务、存储库、工厂、助手、管道等等，而在这里我们将这些类统称为提供者。

​		提供者的主要思想是它可以**注入**依赖项；这意味着对象之间可以创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 mitsuki的运行时系统。

![Components_1](https://nestjs.bootcss.com/assets/Components_1.png)

​		在下面的示例中，我们将会使用`@Injectable()`  装饰器，它是定义基本提供者所**必需的**。

#### 示例（tempDatabase.ts）

``` typescript
@Injectable()
export class TempDatabase {
  constructor() {}
  private database: string[] = [];
  public show() {
    console.log(this.database);
  }
  public put(msg: string) {
    this.database.push(msg);
  }
}
```

### 依赖注入

依赖注入让你可以声明 TypeScript 类的依赖项，而无需操心如何实例化它们，Mitsuki-Core 会为你处理这些琐事。这种设计模式能让你写出更加可测试、也更灵活的代码。我们强烈建议你将其作为最佳实践，并且 Mitsuki-Core 自身的方方面面都在利用了它。

为了说明依赖注入的工作原理，请考虑以下例子：TempDatabase.ts（同上） 中定义了一个 database 数组。它包含一个 show 函数和一个 put 函数，show函数可以输出记录到控制台，而 put 函数则可以存储数据到database 数组中。

接下来，我们向 base.controller.ts 文件中添加一些功能。使其能够保存接受到的群消息的值，并将其打印在控制台中。要访问此功能，可通过向构造函数中添加 private tempDatabase:TempDatabase 来把 TempDatabase 服务注入到 BaseController 类中。

#### 示例（base.controller.ts）

```typescript {3,5}
@Controller()
export class BaseController {
  constructor(private readonly tempDatabase:TempDatabase) {}
  @Handler('GroupMessage')
  public async test(@Data() data:MessageType.GroupMessage) {
    this.tempDatabase.put(data.plain);
    this.tempDatabase.show();
  }
}
```
::: tip
有关依赖注入和 Mitsuki-Core 的更多信息，请参见 Mitsuki-Core 中的依赖注入部分。
:::

### Rxjs

RxJS 是一个使用可观察序列编写异步和基于事件的程序的库。它提供了一种核心类型，即 Observable、一些周边类型（Observer、Scheduler、Subjects）和类似于 Array 方法（map、filter、reduce、every 等）的操作符，以便将异步事件作为集合进行处理。

::: tip
可以将 RxJS 视为处理事件的 Lodash。
:::

ReactiveX 将
**观察者模式**与**迭代器模式**和使用**集合的函数式编程**相结合，以便让你更好地管理事件序列。

RxJS 中解决异步事件管理的基本概念有：

 - Observable（可观察者）：表示未来（future）值或事件的可调用集合的概念。

 - Observer（观察者）：是一个回调集合，它知道如何监听 Observable 传来的值。

 - Subscription（订阅）：表示 Observable 的一次执行，主要用于取消执行。

 - Operator（操作符）：是纯函数，可以使用 map、filter、concat、reduce 等操作来以函数式编程风格处理集合。

 - Subject（主体）：相当于一个 EventEmitter，也是将一个值或事件多播到多个 Observers 的唯一方式。

 - Scheduler（调度器）：是控制并发的集中化调度器，允许我们在计算发生时进行协调，例如 setTimeout 或 requestAnimationFrame 或其它。

::: tip
有关Rxjs的更多信息，请参见[Rxjs官网](https://rxjs.tech/guide/overview)
:::

#### Rxjs 与 Mitsuki-Core 的关系

在Mitsuki-Core中，我们将所有的事件都化为了可观察对象的形式存储在Mitsuki-Core的公共实例库中，供所有模组使用。

通过这种方式，使得我们可以在操作消息流的时候，即可以利用rxjs内置的操作符，来简化一些复杂的流控，以及增加程序的可读性。

具体内容的实现，请参阅：Mitsuki-bot 示例。

## 环境搭建

由于项目还在早期阶段，所以现在想要体验Mitsuki-Core的内容，只能通过克隆仓库的形式进行体验（后期将陆续推出npm包，cli等安装方式）：

``` git
//在控制台中输入以下代码：
git clone git@github.com:gylove1994/mitsuki-core.git
cd ./mitsuki-core
yarn
```

之后我们还需要调整项目根目录的`index.ts`文件，使该文件能够成功引入由您自己创建的Mitsuki-Core实例的入口文件，从而使得项目能够使用指令：`yarn run bot`成功启动。

::: tip
对于使用npm包管理器的用户，可以遵循npm的形式，进行配置。
:::

## 试一试

### 开始之前

我们需要搭建Mirai-api-http环境，具体方式请参阅：[mirai](https://github.com/project-mirai/mirai-api-http)以及[mirai-ts如何使用](https://github.com/YunYouJun/mirai-ts#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8)。

::: tip
为了与下文对应，我们建议您将配置好的setting导入至一个名为`api.apiSetting`的对象中并将其全局导出，以方便使用。
:::

#### setting示例

``` typescript
class ApiSetting {
  public apiSetting: MiraiApiHttpSetting;
  public ormSetting?: DataSourceOptions;
  public expTime: number;
  constructor(api: MiraiApiHttpSetting, ormSetting?: DataSourceOptions, expTime?: number) {
    this.apiSetting = api;
    this.ormSetting = ormSetting ? ormSetting : undefined;
    this.expTime = expTime ? expTime : 30000;
  }
}

export const api = new ApiSetting(
  {
    adapters: ['http', 'ws'],
    enableVerify: false,
    verifyKey: '1145141919',
    debug: true,
    singleMode: true,
    cacheSize: 4096,
    adapterSettings: {
      http: {
        port: 8081,
        host: 'localhost',
        cors: ['*'],
      },
      ws: {
        port: 8080,
        host: 'localhost',
      },
    },
  },
);
```

::: danger

注意：这个文件根据每个人的mirai配置不同将为有一定的变化，请不要直接使用！！！！！

:::


### 一.创建根模块

创建一个文件，并将名字取为`root.module.ts`，并将如下代码粘贴至该文件中：

``` typescript
@Module({
  imports: [],
  controller: [],
  provider: [],
  exports: [],
})
export class RootModule {}
```

这样，一个没有包含任意功能的（根）模块，就创建完毕了，接下来我们将需要把这个模块导入到Mitsuki静态工厂中用于创建Mitsuki实例对象。

### 二.创建Mitsuki实例对象

创建一个文件，并将名字取为`index.ts`，并将如下代码粘贴至该文件中：

``` typescript
async function boot() {
  const app = await MitsukiFactory.create(RootModule, api.apiSetting);
  await app.listen();
}

boot();
```

这样，一个最基本的Mitsuki-Core实例对象就创建完成了，如果这个时候启动Mitsuki-Core的话，就可以看到从控制台发出的
“MitsukiApplication 成功启动”的字样了，可是这样子的Mitsuki-Core 实例对象默认没有任何功能，所以接下来我们就要为他添加一个最基础的功能。

### 三.创建controller

创建一个文件，并将名字取为`root.controller.ts`，并将如下代码粘贴至该文件中：

``` typescript
@Controller()
export class RootController {
  @Handler('GroupMessage')
  public async testGroupMessage() {
    console.log('helloWorld!');
  }
}
```
在创建完`root.controller.ts`文件后，我们需要手动将这个文件导入到我们的根模块“RootModule”中，以让Mitsuki-Core的运行时系统感知到这个控制器。

现在我们回到文件`root.module.ts`中，更新如高亮的代码：

``` typescript {3}
@Module({
  imports: [],
  controller: [RootController],
  provider: [],
  exports: [],
})
export class RootModule {}
```

现在再次启动程序，一个最简单功能的bot就已经搭建成功了，这个bot会在每次收到群消息的时候，向程序的控制台发送一个“helloWorld!”的字符串。

**恭喜！你已经完成了伟大的第一步，接下来就是准备给bot添加更多功能了。**

::: tip
有关功能性及内置模块的使用，请查阅开发指南一栏。
::: 


