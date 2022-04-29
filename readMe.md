# Mitsuki-bot v0.0.1说明文档

## 介绍

<div align=center><img src="https://s2.loli.net/2022/01/23/I7UP6oLlT1azDXi.jpg" alt="psc" style="zoom:50%;" /></div>

Mitsuki-bot是基于[mirai](https://github.com/mamoe/mirai)及[mirai-ts](https://github.com/YunYouJun/mirai-ts)构建的qq消息机器人，其名字取自《巧克甜恋2》中的百々瀬 みつき(Momose Mitsuki)。该项目其主要目的是构建了一个具有清晰结构的qq机器人，但由于个人经验较少，所以该项目应该只是您构建属于您自己项目的参考（如果想直接用也是没问题的啦），同时在该项目中会包含一系列的小实例以帮助您可以更快的了解和上手mirai-ts，最后如果有帮助的话请记得给我一个star，也欢迎各位帮助和改进Mitsuki-bot项目0.0

## 开源许可证

由于[mirai](https://github.com/mamoe/mirai)及[mirai-ts](https://github.com/YunYouJun/mirai-ts)所使用的许可证为**AGPL-3.0 License**，故本项目也使用[AGPL-3.0 License](https://github.com/gylove1994/mitsuki-bot/blob/master/LICENSE)开源许可证，请遵守相关的规范。

## 处理流程

<img src="https://s2.loli.net/2022/01/20/Znt1kYWbHPT6i5l.png" alt="mmcm" style="zoom:50%;" />

受mvc的启发，个人认为QQ机器人对于消息应答的一个完整的处理流程如下：

- 首先，所收到的原始消息经过一个或者数个中间件处理后，根据处理的结果传入到对应的控制器中；
- 其次，由对应的控制器处理对应的事件。其中若需要有关数据库操作及调用其他api时，请将这部分内容交由对应的业务模型完成。
- 最后，由控制器的处理结果表明是否需要对消息进行回复，若需要则由控制器组织回复内容并发出，若不需要则结束这次的事件处理。

## Todo
- 对元数据的key与val的内容进行标准化
- 从依赖中抽离带有标识的函数
- 创建mirai-ts的实例，并创建代理类（代理模式）


