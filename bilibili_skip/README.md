# b站跳过片头片尾脚本

## 脚本原理
利用b站暴露出来的`player`对象结合用户设置的片头和片尾时长来操作播放行为.

## 使用提醒
因为是按照固定片头片尾时长来处理的,所以如果遇到一些片尾时长不规律的会出现问题,导致没有看完就跳过了,这时候刷新页面,看完之后重新执行脚本就行了.

## 配置信息
使用脚本***需要设置两个参数***: **片头时长**和**片尾时长**,单位都是秒.
比如,片头时长为`90s`,片尾时长为`68s`,那么传参:

```
skip(90, 68);
```

## 使用方法
把脚本的内容丢进控制台,***改变参数***,回车执行,之后就可以关掉控制台了.

## 脚本
```js
function skip (start_length, end_length) {
    if (!start_length || !end_length) {
        return console.error('请设置片头和片尾时长')
    }
    let total_time = player.getDuration();
    let skip_point_start = start_length;
    let skip_point_end = total_time - end_length;
    let has_listener = false;
    const interval = 5000;
    window.timer = 0;

    function start () {
        console.log('开搞');
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(handler, interval)
    }
    function handler () {
        let current_time = player.getCurrentTime();
        if (current_time < skip_point_start) {
            console.log('跳过片头')
            return window.player.seek(start_length);
        }
        if (current_time >= skip_point_end) {
            console.log('跳过片尾,下一集')
            if (!has_listener) {
                has_listener = true;
                window.player.addEventListener('video_media_loaded', start);
            }
            return window.player.next();
        }
    }
    start();
}
skip(90, 68);
```
## 其他相关

### b站player对象的一些方法

```js
play // 播放
pause // 暂停
reload // 重新加载
seek // 跳到xx秒
volume
mode
destroy
option
addEventListener // 添加事件监听
removeEventListener // 移除事件监听
getBufferRate
getDuration
isFullScreen
exitFullScreen
getWidth
getHeight
isMute
setMute
getPlaylist
getPlaylistIndex
setPlaylistIndex
getCurrentTime
getState
getVersion
stop
prev
next
reloadAccess
getPlayurl
logger
removeFromPlaylist
appendToPlaylist
screenshot
switchSubtitle
updateSubtitle
updateGuideAttention
verticalDanmaku
setMaskFps
track
directiveDispatcher
getStatisticsInfo
getMediaInfo
getSession
addViewPoints
mock
loadLab
biliMessage
updatePageList
getPlayerState
setPlayerState
noAuxiliary
getVideoMessage
ogvUpdate
```

### player对象的一些事件

```js
video_media_buffer
video_media_buffer_full
video_media_ended
video_media_error
video_media_loaded
video_media_mute
video_media_seek
video_media_time
video_media_volume
```
