# 批量删除QQ空间说说 & 留言脚本
## Changelog
> 2018年01月01日15:59:30 第一版
> <span class="text-danger">2019年5月9日10:20:26 经测试，QQ空间已改版，本脚本不再适用，请悉知。再次更新时间随缘。</span>

## 简介
该脚本`基于http驱动`，不需要与用户交互，操作流畅迅速，**不会出现验证码**，同时方法安全可靠**不会造成封号风险**。

## 声明
该脚本仅供学习、交流使用，任何个人、组织和单位不得用于牟利以及非法活动。

## 使用方法
本仓库所有的脚本都是通过**控制台注入执行**的，**不同功能的脚本在不同的iframe下注入执行**，注入的时候**注意下iframe的区别**。

- [说说删除](#说说删除)
- [留言删除](#留言删除)

### 说说删除
打开空间，选择**说说**Tab页，使页面处于如下图所示状态

![说说Tab页面](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_231036.png)

然后在当前页面打开控制台，在控制台选择**index.html**这个`iframe`

![index.html](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_231229.png)

这时候页面的说说内容部分应该处于选中状态

![说说内容部分状态](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_231256.png)

选择好之后就可以在这里注入[说说删除脚本-delete_shuoshuo.js](https://github.com/aqiongbei/qq_zone_delete/blob/master/delete_shuoshuo.js)了，把这个文件的内容复制、丢进控制台执行即可。脚本执行过程中在左侧页面区域会看到弹窗提示

![开始删除](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_233420.png)

![删除完成](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_233155.png)

> 请忽略数量上的不一致

删除完成的时候会自动刷新页面。这时候说说一般都删完了，整个过程不需要用户交互。

#### Tips

如果你使用快捷键`Ctrl + Shift + J`打开控制台的话会触发空间编辑功能，这时候并不能进入说说Tab页，需要你退出编辑模式使用其他的方式打开快捷键打开控制台。比如：

- Ctrl + Shift + C
- Ctrl + Shift + I
- 右键 -> 检查

### 留言删除
删除留言的操作方式与说说删除的操作方式类似。
我们选择**留言板**Tab页，使页面处于下图的状态

![留言板Tab页](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_234452.png)

然后在当前页面打开控制台，在控制台选择**msgbcanvas.html**这个`iframe`

![](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_234618.png)

这时候页面的留言内容部分应该处于选中状态

![](https://github.com/aqiongbei/qq_zone_delete/blob/master/readme_img/2018-01-03_234629.png)

选择好之后就可以在这里注入[留言删除脚本-delete_liuyan.js](https://github.com/aqiongbei/qq_zone_delete/blob/master/delete_liuyan.js)了，把这个文件的内容复制、丢进控制台执行即可。
脚本执行过程中在左侧页面区域会看到弹窗提示。删除完成的时候会自动刷新页面。这时候留言一般都删完了。

#### Tips

我测试的时候发现每删除100-200条留言的时候腾讯会提示操作频繁，这时候刷新下页面，稍等几分钟，重新开始就好了；这种情况在一大堆留言删除到最后50条时候会每10条出现一次，这里需要频繁的等待、重试。

### 问题
使用过程中有问题欢迎提[Issue](https://github.com/aqiongbei/qq_zone_delete/issues),遇到问题也请先翻Issue。
