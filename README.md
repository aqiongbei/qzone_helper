# `QQ`空间小助手

批量删除`QQ`空间说说&留言的`Chrome`插件

## Changelog

> 2024.09.16 重构`Chrome`插件,取消了`background.js`和`popup.html`,只使用`content_scripts`实现操作和注入
>
> 2024.08.02 修复`Chrome`插件中存在的若干`bug`
>
> 2020.05.24 提供`Chrome`插件([开发过程戳这里](https://segmentfault.com/a/1190000039297715))
>
> 2018.01.01 完成控制台注入脚本开发

## 原理简介

利用插件向页面注入处理逻辑,模拟前端请求实现自动批量删除功能,**不会出现验证码,亦无封号风险**,但是频繁操作仍会触发后端限制逻辑,稍后重试即可,无需担心.

## 声明

该脚本仅供学习、交流使用，任何个人、组织和单位不得用于牟利以及非法活动。

## 使用方法

在浏览器`chrome://extensions/`也页面,点击**`已解压拓展程序`**按钮,导入`chrome_extension/dist`下的文件.在浏览器登录[QQ 空间](https://qzone.qq.com/),登录之后插件图标会亮起,并向页面注入代码,在页面右上角显示操作界面,便可开始使用.
![页面截图](./readme_img/截屏2024-09-16%2020.51.09.png)

#### Tips

无

### 问题

使用过程中有问题欢迎提[Issue](https://github.com/aqiongbei/qzone_helper/issues),遇到问题也请先翻 Issue。
