'use strict'

const {getFilesInfo, requestSync, readJson, formatLog} = require('./utils');

/**
 * 配置字段介绍
 * BDUSS 在浏览器登录百度网盘，获取 BDUSS Cookie 值
 * TARGET_DIR 要整合到的目标目录，这个目录必须已经存在
 */
const BDUSS = 'UJzMnNsNHlEbmdCZ0dUY20tMWg0Qk5FUnFZOVZXS0RIZk1-aTk5Z2ZQOTBKTWhkRVFBQUFBJCQAAAAAAAAAAAEAAADaBKEHztLSssrHwM9BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHSXoF10l6BdS';
const TARGET_DIR = '/新建文件夹';
// const BDUSS = 'your baiduyun cookie';
// const TARGET_DIR = 'your target dir';

if (!BDUSS || !TARGET_DIR) {
    return console.log(formatLog('缺少必须参数，脚本无法执行！', 'error'))
}

;(async () => {
    let share_links = readJson('share_links');
    for (let index in share_links) {
        let item = share_links[index];
        console.log(formatLog(index))
        console.log(item)
        let cookie_str = '';
        let real_share_id = '';

        if (item.link && item.link.includes('pan.baidu.com')) {
            if (item.code) {
                // get real share id, 302 redirect
                let ret =  await requestSync({url: item.link});
                real_share_id = ret.request.path.replace('/share/init?surl=', '');
                let verify_options = {
                    method: 'post',
                    url: `https://pan.baidu.com/share/verify?surl=${real_share_id}&t=${+new Date}&chnnel=&web=1&app_id=&bdstoken=null&logid=&clienttype=0`,
                    headers: {
                        Referer: `https://pan.baidu.com/share/init?surl=${real_share_id}`,
                        Origin: 'https://pan.baidu.com',
                        'Sec-Fetch-Mode': 'cors'
                    },
                    form: {
                        pwd: item.code,
                        vcode: '',
                        vcode_str: ''
                    }
                }
                // verify baidu code
                ret =  await requestSync(verify_options);
                if (ret.body && ret.body.includes('randsk')) {
                    console.log('get cookie success!')
                } else {
                    console.log(formatLog(index, 'error'))
                    console.log('get cookie failed with:', ret.body)
                    continue;
                }
                // get cookie
                cookie_str = JSON.parse(ret.body).randsk;
            } else {
                cookie_str = '';
            }
            let options = {
                url: item.link,
                headers: {
                    Referer: real_share_id ? `https://pan.baidu.com/share/init?surl=${real_share_id}` : item.link,
                    Origin: 'https://pan.baidu.com',
                    'Sec-Fetch-Mode': 'cors',
                    "Cookie": real_share_id ? `BDCLND=${cookie_str}`: ''
                },
            }
            let real_baidu_page =  await requestSync(options);
            let files_info = getFilesInfo(real_baidu_page.body);
            if (files_info.shareid && files_info.from && files_info.fsidlist.length > 0) {
                console.log('get files info success!')
            } else {
                console.log(formatLog(index, 'error'))
                console.log('get files info failed with:', files_info);
                continue;
            }
            let push_options = {
                url: `https://pan.baidu.com/share/transfer?shareid=${files_info.shareid}&from=${files_info.from}&channel=&web=1&app_id=&bdstoken=null&logid=null&clienttype=0`,
                method: 'post',
                headers: {
                    Referer: item.link,
                    Origin: 'https://pan.baidu.com',
                    'Sec-Fetch-Mode': 'cors',
                    "Cookie": `BDCLND=${cookie_str};BDUSS=${BDUSS}`
                },
                form: {
                    fsidlist: JSON.stringify(files_info.fsidlist),
                    path: TARGET_DIR
                }
            }
            // save to my baiduyun
            let save_ret =  await requestSync(push_options);
            if (save_ret.body && save_ret.body.includes('"errno":0')) {
                console.log('save to my baiduyun success!')
            } else {
                console.log(formatLog(index, 'error'))
                console.log('save to my baiduyun failed with:', save_ret.body)
                continue;
            }
        } else {
            console.log('Invaild Baidu yun link')
        }
    }
})();

