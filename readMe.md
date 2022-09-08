

# Mitsuki-bot v0.9.0(pre-release)说明文档

## 介绍

<div align=center><img src="https://s2.loli.net/2022/01/23/I7UP6oLlT1azDXi.jpg" alt="psc" style="zoom:50%;" /></div>

​		Mitsuki-bot是基于[mirai](https://github.com/mamoe/mirai)及[mirai-ts](https://github.com/YunYouJun/mirai-ts)构建的qq消息机器人，其名字取自《巧克甜恋2》中的百々瀬 みつき(Momose Mitsuki)。该项目其主要目的是构建了一个渐进式，可靠的具有清晰结构的qq机器人框架。

​		同时在该项目中会包含一系列的小实例以帮助您可以更快的了解和上手mirai-ts，最后如果有帮助的话请记得给我一个star，也欢迎各位帮助和改进Mitsuki-bot项目0.0

## 开源许可证

​		由于[mirai](https://github.com/mamoe/mirai)及[mirai-ts](https://github.com/YunYouJun/mirai-ts)所使用的许可证为**AGPL-3.0 License**，故本项目也使用[AGPL-3.0 License](https://github.com/gylove1994/mitsuki-bot/blob/master/LICENSE)开源许可证，请遵守相关的规范。

## 哲学

​		近年来，由于 Node.js、JavaScript 已经成为 web 前端和后端应用程序的“通用开发语言”。这促成了诸如 [Angular](https://angular.io/)、[React](https://github.com/facebook/react) 和 [Vue](https://github.com/vuejs/vue) 等优秀项目的出现，他们提高了开发者的工作效率，并能够创建快速、可测试和可扩展的前端应用程序。然而，尽管 Node （和服务器端 JavaScript）拥有大量优秀的软件库、辅助程序和工具，但没有一个能够有效地解决我们所面对的主要问题，即 **架构**。

​		mitsuki-bot提供了一个开箱即用的QQ机器人的体系结构，允许开发者创建高度可扩展、松散耦合且易于维护的应用程序，这种架构深受 nestjs 的启发。

## 安装

### 1.安装mcl并配置mirai-api-http

​	相关内容请查看https://github.com/mamoe/mirai/blob/dev/docs/ConsoleTerminal.md

### 2.安装mitsuki

​	现阶段仅能通过克隆git库的形式进行安装（后续将提供npm及mitsuki-cli的安装方式）：

```shell
$ git clone https://github.com/gylove1994/mitsuki-core.git mitsuki
$ cd mitsuki
$ yarn
$ yarn run start
```

## 迈出伟大的第一步

​		聚焦到项目目录中的src/example文件夹，这里有一个完整的有关于利用构建的qq机器人的完整示例，如果你使用过nestjs等框架，你一定对于这种文档结构不会感到陌生，如果你不太清楚，也没有关系。以下是各类文件作用的简单介绍：

| 文件名              |                  说明                   |
| :------------------ | :-------------------------------------: |
| index.ts            |           框架启动的入口文件            |
| first-module.ts     |        用于构建mitsuki的基模块类        |
| first-controller.ts |         用于接收和处理事件的类          |
| first-service.ts    |       用于保存可复用处理逻辑的类        |
| Temp-database.ts    |  可直接由mitsuki框架实例化的外部类示例  |
| api-setting.ts      | 不可直接由mitsuki框架实例化的外部类示例 |

### 1.Module（模块）

​		模块是一个用`@Module()`装饰器注解的类。`@Module()`装饰器提供了**mitsuki**用来组织qq机器人结构的元数据。

![Modules_1](https://s2.loli.net/2022/07/02/2BMqDvHcTesywk8.png)

​		每个由mitsuki构建的qq机器人至少有一个模块，即**根模块**。**根模块是 mitsuki 用来构建整个应用**的起点——mitsuki用来解决模块（module）和提供者（provider）关系和依赖关系的内部数据结构。虽然理论上非常小的qq机器人可能只有根模块（如同示例一样），但这不是常见的情况。我**强烈**建议将模块作为组织代码的有效方式。因此，对于大多数qq机器人，最终的架构将采用多个模块，每个模块都封装了一组密切相关的**功能**。功能模块只是用于组织与特定功能相关的一系列代码，这样做可以使代码变得井井有条的同时建立清晰的边界。尤其是随着应用程序变得越来越大和复杂时，这有助于管理复杂性并使用[SOLID](https://en.wikipedia.org/wiki/SOLID)原则进行开发。

#### 示例（first-module.ts）

```typescript
import { FirstController } from './first-controller';
import { FirstService } from './first-service';
import { Module } from "../core/decorators";
import { api } from './api-setting';

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
export class FirstModule{}

```

#### 开放与封闭及单例模式

​	与nestjs不同，在目前版本的 mitsuki-bot 中，通过模块导入的任意内容默认是**单例并共享**的。因此在不同的模块间，所实例化的内容将不会被二次创建。若不希望以单例模式运行，则需要借助存取库的方式进行读取（尚未实现）。

​	**注意⚠️！有关开放与封闭的部分内容极可能将在未来的版本中发生原则性修改！**

#### 计划中的更新

1. 通过模块导入的任意内容默认是**封闭**的，在一个模块中创建的类需要手动导出（共享）才能被其他模块所使用。
2. 添加非单例模式的处理机制

### 2.Controller（控制器）

​	控制器负责处理**事件**并做出相对应的处理。

![Controllers_1](https://docs.nestjs.com/assets/Controllers_1.png)

​		控制器的目的是负责处理**事件**并对事件做出相对应的处理。为了创建一个基本的控制器，我们使用类和**装饰器**。装饰器将类与所需的元数据相关联，并使mitsuki能将对应的处理映射到与之对应的控制器中。

​		在下面的示例中，我们将使用`@Controller()`装饰器，它是定义基本控制器所**必需的。**

​		而在在类方法上的`@FriendMessage()` `@GroupMessage()` `@BotOnlineEvent()`的装饰器则是用来指定所处理事件的装饰器，被此类装饰器装饰的方法将会在相对应的事件发生时被自动调用。

​		控制器类上方法的参数可以直接获取所有已经导入于mitsuki的类的实例对象及由mitsuki工厂函数创建的类的实例对象，mitsuki在创建的时候会将所有的消息类型封装为一个消息类的实例对象，命名规则为‘’事件名+Data“的形式。在每次新的事件发生时，相对应的消息类会被更新。

#### 示例（first-Controller.ts）

```typescript
import { FriendMessageData, GroupMessageData } from './../core/mitsuki-core';
import { FirstService } from './first-service';
import { BotOnlineEvent, Controller, FriendMessage, GroupMessage } from '../core/decorators';

@Controller()
export class FirstController {
  constructor(private readonly firstService: FirstService) {}
  @FriendMessage()
  public async helloMitsuki(msg: FriendMessageData) {
    await this.firstService.helloMitsuki(msg.data);
  }
  @GroupMessage()
  public async saveToTempDatabase(msg: GroupMessageData) {
    await this.firstService.saveToTempDatabase(msg.data);
  }
  @BotOnlineEvent()
  public async online() {
    console.log('bot上线啦！！！！！');
  }
}

```

### 3.providers（提供者）

​		**提供者**是mitsuki的一个基本概念。许多基本的类是提供一个服务或者一个功能的类——服务、存储库、工厂、助手等等，而在这里我们将这些类统称为提供者。

​		提供者的主要思想是它可以**注入**依赖项；这意味着对象之间可以创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 mitsuki的运行时系统。

![Components_1](https://nestjs.bootcss.com/assets/Components_1.png)

​		在下面的示例中，我们将会使用`@Injectable()`  装饰器，它是定义基本提供者所**必需的。**以及两个提供者与两个提供者之间的依赖关系。

​		`TempDatabase` 类是一个非常简单的功能类，它只实现了保存聊天信息并将聊天信息打印到控制台的功能。

​		`FirstService` 类是一个非常简单的服务类，它使用了`TempDatabase` 类作为其依赖项构建了一个简单服务。尽管`TempDatabase` 类没有被显式写入模块的提供者中，但是mitsuki的运行时系统将会试图在实例化`FirstService` 类时为其自动创建。

​		**注意：提供者的构造函数中所出现的参数只能是其他提供者或者已经被导入Mitsuki的外部实例对象。**

#### 示例（temp-database.ts）

```typescript
import { Injectable } from '../core/decorators';
@Injectable()
export class TempDatabase{
  private database:string[] = [];
  public show(){
    console.log(this.database);
  }
  public put(msg:string){
    this.database.push(msg);
  }
}
```

#### 示例（first-service.ts）

```typescript
import { MessageType } from 'mirai-ts';
import { Injectable } from "../core/decorators";
import { TempDatabase } from './temp-database';

@Injectable()
export class FirstService{
  constructor(private readonly tempDatabase:TempDatabase){}
  public async helloMitsuki(msg:MessageType.FriendMessage){
    msg.reply('helloWorld!');
  }
  public async saveToTempDatabase(msg:MessageType.GroupMessage){
    this.tempDatabase.put(msg.plain);
    this.tempDatabase.show();
  }
}
```

### 4.导入外部实例

​		在使用的过程中，有时我们会需要在mitsuki中使用根据特定条件创建的实例对象。在下面的示例中，我们将导入一个简单的保存了MiraiApiHttpSetting信息的类。(导入部分在模块示例中)

```typescript
import { MiraiApiHttpSetting } from "mirai-ts";

class ApiSetting{
  public apiSetting:MiraiApiHttpSetting;
  constructor(api:MiraiApiHttpSetting){
    this.apiSetting = api;
  }
}


export const api = new ApiSetting({
  "adapters": ["http", "ws"],
  "enableVerify": false,
  "verifyKey": "1145141919",
  "debug": true,
  "singleMode": true,
  "cacheSize": 4096,
  "adapterSettings": {
    "http": {
      "port": 8081,
      "host": "localhost",
      "cors": ["*"]
    },
    "ws": {
      "port": 8080,
      "host": "localhost"
    }
  }
})
```
