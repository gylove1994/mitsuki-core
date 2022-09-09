#### 开放与封闭及单例模式

​		在v0.9中，任意导入mitsuki模块中的依赖项的作用域是所有受mitsuki容器所共享，这会导致所有模块都可以直接修改由另外模块创建的内容。虽然这为一部分场景提供了方便，但是这种方式显著的增加了模块间的耦合性，使模块与模块之间的界限变得模糊，并最终可能会使mitsuki-bot实例在运行时发生无法预计的错误。所以在v1.0正式版本中，我们调整了依赖的作用域范围，将依赖的默认作用域限制在了每个模块内部，并通过元信息注解的方式导入和导出，这显著提升了模块的安全性。

#### 模块的构建方式

​		在v0.9中，我们使用`@Module`装饰器的4个参数来构建一个模块：

```typescript
@Module({
  //导入非mitsuki创建的类的实例对象
  imports:[api],
  //导入控制器类
  controllers:[FirstController],
  //导入提供者
  providers:[FirstService],
  //导入其他的模块
  modules:[]
})
```

​		而在v1.0中，我们更改了`@Module`装饰器的参数表，使其与其他框架具有较高的统一性，有效的降低了学习成本。

```typescript
@Module({
  //用于导入其他的模块所导出的provider
  imports: [TestModule],
  //用于观察者订阅可观察对象（消息的处理）
  controller: [BaseController],
  //用于导入提供者
  provider: [BaseService],
  //用于导出提供者
  exports: [BaseService],
})
export class BaseModule {}
```

​		对于`imports` `provider` `exports` 在v1.0的版本中额外添加了异步工厂的方式导入，使得动态模块的构建变得简单:

```typescript
@Module({
  imports: async () => [...],
  controller: [...],
  provider: async () => [...],
  exports: async () => [...],
})
export class BaseModule {}
```

​		除此之外，为了更加方便的通过所给参数动态的构建模块，我们新添加了一个`DynamicModule`类型，通过类的静态方法来传入参数，进而更加细致控制动态模块的创建过程：

```typescript
public static importRepository(...entity: Constructor[]): DynamicModule {
    return {
      name: this.name,
      imports: [],
      provider: async () =>
        entity.map((val) => {
          return {
            provider: '[ormModule:repository]' + val.name,
            useFactory: async () => (await this.getDataSource()).getRepository(val),
          };
        }) as Provider[],
      exports: async () => entity.map((val) => '[ormModule:repository]' + val.name),
    };
  }
```

### 控制器

控制器负责处理**事件**并做出相对应的处理。

![Controllers_1](https://docs.nestjs.com/assets/Controllers_1.png)

​		控制器的目的是负责处理**事件**并对事件做出相对应的处理。为了创建一个基本的控制器，我们使用类和**装饰器**。装饰器将类与所需的元数据相关联，并使mitsuki能将对应的处理映射到与之对应的控制器中。

::: tip
下面示例中涉及类较多有关于管道的内容，如果对于管道概念不了解可以先暂时跳过。
:::

​		在下面的示例中，我们将使用`@Controller()`装饰器，它是定义基本控制器所**必需的。**

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

​		而在在类方法上的`@Handler()`装饰器则是用来订阅指定的可观察对象。`@Handler()`装饰器接受1-n个参数，其中第一个是指定监听事件的名称，而剩下的参数则是操作符（operator）或者是实现了RxPipe抽象类的类。

​		使用实现了RxPipe抽象类的类有一个好处，就是可以通过依赖注入来为操作符实现中增加必要的依赖，以实现更复杂的逻辑。

#### 示例（list.rx.pipe.ts）

```typescript
@Injectable()
export class ListPipe implements RxPipe {
  constructor(@Inject({ ProviderName: 'list' }) private readonly list: number[]) {}
  public buildRxPipe(): OperatorFunction<any, any> {
    return pipe(
      filter((val: MessageType.ChatMessage) => {
        let pass = false;
        this.list.forEach((v) => {
          if (val.sender.id == v) {
            pass = true;
          }
          console.log(val.sender.id, v, v === val.sender.id);
        });
        return pass;
      }),
    );
  }
}
```



​		只能作用于控制器类上方法的方法参数装饰器`@Data()`可以获得经过操作符修改过后对应可观察对象的值，如果没有修改，则会返回对应可观察对象的所发出的值。对于大部分的方法参装饰器默认都可以使用实现了MitsukiPipe抽象类的类或者实例对象，用作值的转换、类型的检查或者增加执行副作用。

​		使用实现了MitsukiPipe抽象类的类有一个好处，就是可以通过依赖注入来为操作实现中增加必要的依赖，以实现更复杂的逻辑。

#### 示例（text.mitsuki.pipe.ts）

```typescript
@Injectable()
export class TextPipe implements MitsukiPipe {
  public transform(val: any) {
    if (isGroupMessage(val)) {
      return val.plain;
    } else {
      throw new Error('类型错误');
    }
  }
}
```

​		方法参数装饰器`@Inject()`是最为通用的方法参数装饰器，他接收一个特殊的对象。这个对象一个必填参数：ProviderName（注意大写）则是指定的存取令牌。通过这个存储令牌，可以获取任何已知的在作用域范围内 的provider。

::: tip
​		方法参数装饰器`@Inject()`还有更奇怪的用法，比如为其直接赋值的useValue方法，以及不那么奇怪的管道，他们都是可选的。useValue这种方法通常与拦截器共同使用，在最后时刻，改变指定项的值。（比如内置的`@Data()`装饰器的实现就是基于useValue。但是这种奇怪的方式可能会在将来的更新中被移除，抑或着是将其以一种新的形式开放。）
:::

#### 示例（root.controller.ts）

```typescript
@Controller()
export class RootController {
  constructor(@Inject({ ProviderName: 'random_2' }) private readonly random: number) {}
  @Handler('GroupMessage', ListPipe)
  public log(@Data(TextPipe) data: string, @Inject({ ProviderName: 'random' }) r: number) {
    console.log(data, r, this.random);
  }
}

```

### 提供者

​		**提供者**是mitsuki的一个基本概念。许多基本的类是提供一个服务或者一个功能的类——服务、存储库、工厂、助手、管道等等，而在这里我们将这些类统称为提供者。

​		提供者的主要思想是它可以**注入**依赖项；这意味着对象之间可以创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 mitsuki的运行时系统。

![Components_1](https://nestjs.bootcss.com/assets/Components_1.png)

​		在下面的示例中，我们将会使用`@Injectable()`  装饰器，它是定义基本提供者所**必需的**。

#### provider的构建方式

​		在构建provider时，我们相对于v0.9增加`useFactory` `useClass` `useValue`  方法：

```typescript
type Provider = {
  provider: string;
  //new
  useFactory?: (...params: any[]) => any;
  //new
  useClass?: Constructor;
  //new
  useValue?: any;
  //new，之后介绍
  scope?: Scope;
};
```

​		对于大多数的provider的构建，并不需要使用这些特殊的方法，mitsuki的运行时系统会帮助你处理好一切。但是在对于一些特殊的provider（比如基础类型值的provider）可能会使得mitsuki运行时系统无法正确的传递依赖，这时就需要通过provider的完整导入方式进行导入，比如:

```typescript
{
  provider: 'randomNumber',
  useFactory: () => Math.random(),
  scope: Scope.MESSAGE,
}
```

#### scope选项

​		scope选项是这个版本新加入的内容，他提供了有别于单例模式的实现。在大多数情况下，使用单例模式都将是最优选择。但是有些情况下，我们会希望在一个特殊实例中储存一些特别的状态（比如handler的调用次数）而这些状态将与某一个特定的provider、controller、handler高度相关（Scope.TRANSIENT），或者与每一个订阅内容高度相关（Scope.MESSAGE），这时我们就可以通过设置Scope选项来达到这种特殊的效果。不过由于Scope选项会打破单例模式，所以这种选项除非必要，一般情况下是不建议使用的。不过，多一种选择总归是一种好事。

