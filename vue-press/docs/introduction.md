# 介绍

## 关于Mitsuki
<div align=center><img src="https://s2.loli.net/2022/01/23/I7UP6oLlT1azDXi.jpg" alt="psc" style="zoom:50%;" /></div>

Mitsuki-Core是基于[mirai](https://github.com/mamoe/mirai)及[mirai-ts](https://github.com/YunYouJun/mirai-ts)构建的qq消息机器人，其名字取自《巧克甜恋2》中的百々瀬 みつき(Momose Mitsuki)。该项目其主要目的是构建了一个渐进式，可靠的具有清晰结构的qq机器人框架。

## 哲学

​近年来，由于 Node.js、JavaScript 已经成为 web 前端和后端应用程序的“通用开发语言”。这也促成了诸如 mirai-ts等优秀项目的出现，他们实现了在node环境中编写QQ机器人的第一步。

​然而，尽管 Node 拥有大量优秀的软件库、辅助程序和工具。但是这些软件库、辅助程序和工具在每一个独立的qq机器人中都需要做一次适配工作，这就使得大量开发者将会花费大量冗余的时间在一些相同的地方。而且由于实现方式的不同，对不同的qq机器人项目中的代码进行复用也会变得十分困难，这也导致了使用nodejs开发qq机器人的社区活跃度要远低于java，python等语言，尽管js拥有着世界上活跃度最高的社区。而Mitsuki-core的出现将有效地解决我们所面对的主要问题：即 **架构**。

​		Mitsuki-core 提供了一个开箱即用的应用程序体系结构，允许开发者及其团队创建高度可测试、可扩展、松散耦合且易于维护的QQ机器人应用实例。这种架构深受 Angular以及nodejs 的启发。

## 特性

### 控制反转与注解式编程

​Mitsuki-Core 完美利用了TypeScript所提供的装饰器语法及reflect-metadata库所提供的元信息编程的能力，构建了一套以依赖注入为核心的运行时系统。

### 遵循最佳实践

Mitsuki-Core有意设计的与您熟悉的框架相似，使您在构建高质量可复用的QQ机器人项目上，可以遵循与其他框架相同的最佳实践。

### 开箱即用

Mitsuki-Core官方提供了完整的脚手架工具（Mitsuki-Cli）以及许多的可供选择的内置库、详尽的文档与视频教程，为您上手Mitsuki-Core提供全方位的支持。

### 可测试

Mitsuki-Core官方通过与jest的高度整合，通过建立独立的由官方维护的测试模块实例来测试由用户所构建的Mitsuki-Core实例。

<!-- ### 低耦合 高内聚

模块系统及模块作用域的引入，使得每个单独的实例都可以整体作为一个独立的模块，被导入到其他实例之中。这充分的降低了模块间的耦合关系，并提高了模块的内聚。

### 高可复用

模组的直接引入，就已经充分展现了代码的可复用性。 -->
