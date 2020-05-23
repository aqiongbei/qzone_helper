console.log('content js loaded');
function showTips (msg, type = 'info') {
    // "succeed", "fail", "loading"
    let popup_el = document.querySelector('.ui-popup');
    if (!popup_el) {
        popup_el = document.createElement("div");
        popup_el.role = "dialog";
        popup_el.tabindex = -1;
        popup_el.className = 'ui-popup ui-popup-show ui-popup-focus';
        popup_el.style.display = 'none';
        popup_el.style.position = 'fixed';
        popup_el.style.left = '50%';
        popup_el.style.top = '40%';
        popup_el.style.transform = 'translate(-50%, -50%)';
        popup_el.style.bottom = 'auto';
        popup_el.style.right = 'auto';
        popup_el.style.margin = 'auto';
        popup_el.style.padding = 'auto';
        popup_el.style.outline = 0;
        popup_el.style['z-index'] = 999990;
        popup_el.style.border = '0 none';
        popup_el.style.background = 'transparent';
        document.body.appendChild(popup_el);
    }
    let str = `<div class="qz-tips-box qz-tips-box-m"><div class="tips-box-txt tips-${type}"><i class="icon-${type}-m"></i>${msg}</div></div>`;
    popup_el.innerHTML = str;
    // 消息提示已经关闭了
    if (popup_el.style.display == 'none') {
        popup_el.style.display = 'block';
    }
    // 实现带有队列的消息提示
    // 通过队列展示消息,保证消息展示的连续性
    let timer = setTimeout( () => {
        window.tip_queue.shift();
        if (window.tip_queue.length == 0) {
            popup_el.style.display = 'none';
        }
    }, 3000);
    window.tip_queue.push(timer);
}

function serialize(obj) {
    let result = '';
    for (let key in obj) {
        if (result === '') {
            result += key + '=' + obj[key];
        } else {
            result += '&' + key + '=' + obj[key];
        }
    }
    return result;
}
function getCookie (key) {
    let arr = document.cookie.split('; ');
    let cookie = {};
    arr.map(item => {
        let v = item.split('=');
        cookie[v[0]] = v[1]
    })
    if (key) {
        return cookie[key]
    } else {
        return cookie;
    }
}

function getGTK () {
    let cookie = getCookie();
    let t = cookie.p_skey || cookie.skey || cookie.rv2;
    let n = 5381;
    for (let i = 0, o = t.length; i < o; ++i) {
        n += (n << 5) + t.charAt(i).charCodeAt()
    }
    return n & 2147483647
}

function getBaseInfo () {
    let info = {};
    info.g_tk = getGTK();
    info.reffer = window.location.href;
    for (let el of document.scripts) {
        // token
        let text = el.innerText;
        // console.log(text)
        let target_text = 'window.g_qzonetoken = (function(){ try{return';
        if (text && text.includes(target_text)) {
            let token = /"([^;]+)"/.exec(text)[1];
            info.token = token;
        }
        // uin
        target_text = 'g_iUin=';
        if (text && text.includes(target_text)) {
            let uin = /(\d+),/.exec(text)[1];
            info.uin = uin;
        }
    }
    console.log(info)
    return info;
}

function ajax(options, cb) {
    let xhr = new XMLHttpRequest();
    let qs = options.qs;
    if (qs) {
        let str = '?';
        for (let key in qs) {
            if (str === '?') {
                str += key + '=' + qs[key];
            } else {
                str += '&' + key + '=' + qs[key];
            }
        }
        options.url += str;
    }
    xhr.open(options.method, options.url, true);
    if (options.method == 'GET') {
        xhr.setRequestHeader("Content-Type", "text/html; charset=utf-8");
    } else {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    }
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (/^2\d{2}/.test(xhr.status) || xhr.status === 304)) {
            if (xhr.response) {
                let data = xhr.response;
                try {
                    data = JSON.parse(xhr.response);
                } catch (e) {

                }
                cb && cb(data);
            }
        }
    }
    xhr.send(serialize(options.data))
}

function download (data, filename, cb) {
    let b = new Blob([data], {type: 'text/plain'});
    let download_url = URL.createObjectURL(b);
    let el = document.createElement("a");
    el.style = "display:none";
    el.href = download_url;
    el.download = filename;
    document.body.appendChild(el);
    el.click();
    setTimeout( () => {
        // 通过createObjectURL创建的url需要通过revokeObjectURL()来释放
        URL.revokeObjectURL(download_url);
        el.href = '';
        cb && cb();
    })
}
// Talk
function deleteTalk () {
    let list = window.talk_list.splice(0, 3);
    list.map(msg => {
        if (!msg.tid) return;
        ajax({
            url: 'https://user.qzone.qq.com/proxy/domain/taotao.qzone.qq.com/cgi-bin/emotion_cgi_delete_v6',
            method: 'POST',
            qs: {
                qzonetoken: base_info.token,
                g_tk: base_info.g_tk,
            },
            data: {
                hostuin: base_info.uin,
                tid: msg.tid,
                t1_source: 1,
                code_version: 1,
                format: 'fs',
                qzreferrer: base_info.reffer,
            }
        }, function (res) {
            if (res.includes('成功')) {
                showTips(`删除说说${msg.tid}成功!`)
            } else if (res.includes('请先登录空间')) {
                showTips(`删除说说失败!操作异常被锁定.任务已暂停,请稍后重试!`, 'fail');
                window.stop_task = true;
                window.talk_list = [];
            } else {
                showTips(`删除说说${msg.tid}失败!\n${res}`)
            }
        });
    })
    if (!window.stop_task) {
        setTimeout( () => {
            if (window.talk_list && window.talk_list.length) {
                deleteTalk();
            } else {
                deleteTalkHandler();
            }
        }, 5000);
    }
}
function getTalkList (opt, cb) {
    let config = {
        url: 'https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6',
        method: 'GET',
        qs: {
            uin: base_info.uin,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            hostUin: base_info.uin,
            notice: 0,
            sort: 0,
            pos: 0,
            num: 20,
            cgi_host: 'https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6',
            code_version: 1,
            format: 'json',
            need_private_comment: 1,
            g_tk: base_info.g_tk,
            qzonetoken: base_info.token,
            g_tk: base_info.g_tk
        }
    };
    if (opt && opt.qs) {
        config.qs = Object.assign(config.qs, opt.qs);
    }
    if (opt && opt.data) {
        config.data = Object.assign(config.data, opt.data);
    }
    ajax(config, function (res) {
        showTips(`获取说说列表成功! 当前进度: ${window.talk_list.length} / ${res.total}条数据`);
        cb && cb(res);
    });
}
// Comment
function getCommentList (opt, cb) {
    let config = {
        url: 'https://user.qzone.qq.com/proxy/domain/m.qzone.qq.com/cgi-bin/new/get_msgb',
        method: 'GET',
        qs: {
            uin: base_info.uin,
            hostUin: base_info.uin,
            sort: 0,
            s: 0.7434565759252794,
            format: 'json',
            num: 20,
            start: 0,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            g_tk: base_info.g_tk,
            qzonetoken: base_info.token,
            g_tk: base_info.g_tk
        }
    };
    if (opt && opt.qs) {
        config.qs = Object.assign(config.qs, opt.qs);
    }
    if (opt && opt.data) {
        config.data = Object.assign(config.data, opt.data);
    }
    ajax(config, function (res) {
        showTips(`获取留言列表成功! 当前进度:${window.comment_list.length} / ${res.data.total}`);
        cb && cb(res);
    });
}

function deleteComment () {
    let list = window.comment_list.splice(0, 1);
    list.map(comment => {
        if (!comment.id) return;
        ajax({
            url: 'https://h5.qzone.qq.com/proxy/domain/m.qzone.qq.com/cgi-bin/new/del_msgb',
            method: 'POST',
            qs: {
                qzonetoken: base_info.token,
                g_tk: base_info.g_tk,
            },
            data: {
                hostUin: base_info.uin,
                idList: comment.id,
                uinList: base_info.uin,
                format: 'fs',
                iNotice: 1,
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                ref: 'qzone',
                json: 1,
                g_tk: base_info.g_tk,
                qzreferrer: 'https://user.qzone.qq.com/proxy/domain/qzs.qq.com/qzone/msgboard/msgbcanvas.html#page=1'
            }
        }, function (res) {
            if (res.includes('成功删除')) {
                showTips(`删除留言${comment.id}成功!`);
            } else {
                // 删除失败的再回收一下
                window.comment_list.push(comment);
                showTips(`删除留言${comment.id}失败:\n${res}!`);
            }
        });
    })
    setTimeout( () => {
        if (window.comment_list && window.comment_list.length) {
            deleteComment();
        } else {
            deleteCommentHandler();
        }
    }, 5000);
}
function exportTalkHandler () {
    function foo (res) {
        console.log('cb', res)
        if (res.total) {
            window.talk_list = window.talk_list.concat(res.msglist);
        }
        if (window.talk_list.length >= res.total) {
            download(JSON.stringify(window.talk_list, 4, ' '), `talk_list.json`);
            window.talk_list = [];
            showTips('导出说说完成!', 'succeed');
        } else {
            let opt = {
                qs: {
                    pos: window.talk_list.length
                }
            }
            getTalkList(opt, foo);
        }
    }
    getTalkList(null, foo);
}
function deleteTalkHandler () {
    function foo (res) {
        console.log('cb', res)
        if (res.total) {
            window.talk_list = res.msglist;
            deleteTalk();
        } else {
            showTips('删除说说完成!', 'succeed');
        }
    }
    getTalkList(null, foo);
}

function deleteCommentHandler () {
    function foo (res) {
        if (res.data && res.data.total) {
            window.comment_list = res.data.commentList;
            deleteComment();
        } else {
            showTips('删除留言完成!', 'succeed');
        }
    }
    getCommentList(null, foo);
}

function exportCommentHandler () {
    function foo (res) {
        console.log('cb', res)
        if (res.data && res.data.commentList) {
            window.comment_list = window.comment_list.concat(res.data.commentList)
        }
        if (window.comment_list.length >= res.data.total) {
            download(JSON.stringify(window.comment_list, 4, ' '), `comment_list.json`);
            window.comment_list = [];
            showTips('导出留言完成!', 'succeed');
        } else {
            let opt = {
                qs: {
                    start: window.comment_list.length
                }
            }
            getCommentList(opt, foo);
        }
    }
    getCommentList(null, foo);
}

function preCheck () {
    // https://rc.qzone.qq.com/infocenter?via=toolbar&_t_=0.3928029360436276&
    // to
    // https://user.qzone.qq.com/xxx
    if (!window.location.href.includes('user.qzone.qq.com')) {
        window.location.href = 'https://qzone.qq.com';
    }
}

function init () {
    window.comment_list = [];
    window.talk_list = [];
    window.blog_list = [];
    window.comment_total = 0;
    window.comment_has_total = 0;
    window.talk_total = 0;
    window.blog_total = 0;
    window.comment_page = 0;
    window.base_info = getBaseInfo();
    window.stop_task = false;
    window.tip_queue = [];
    preCheck();
}

function notice (msg) {
    chrome.runtime.sendMessage('msg')
}
const TASK_TYPE = {
    export_talk: {
        key: 'export_talk',
        name: '导出说说'
    },
    delete_talk: {
        key: 'delete_talk',
        name: '删除说说'
    },
    export_comment: {
        key: 'export_comment',
        name: '导出留言'
    },
    delete_comment: {
        key: 'delete_comment',
        name: '删除留言'
    },
    export_blog: {
        key: 'export_blog',
        name: '导出日志'
    },
    delete_blog: {
        key: 'delete_blog',
        name: '删除日志'
    },
    export_photo: {
        key: 'export_photo',
        name: '导出相册'
    },
    delete_photo: {
        key: 'delete_photo',
        name: '删除相册'
    },
    delete_all: {
        key: 'delete_all',
        name: '一键清空说说+留言+日志+相册'
    }
};
function dispatch (opt) {
    init();
    showTips(`开始处理 < ${TASK_TYPE[opt.type].name} > 任务`)
    switch (opt.type) {
        case TASK_TYPE.export_talk.key:
            exportTalkHandler();
            break;
        case TASK_TYPE.delete_talk.key:
            deleteTalkHandler();
            break;
        case TASK_TYPE.export_comment.key:
            exportCommentHandler();
            break;
        case TASK_TYPE.delete_comment.key:
            deleteCommentHandler();
            break;
    }
}
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log('content.js recive msg:', message, sender);
    dispatch(message);
    sendResponse({is_recive: true, orion: 'content.js'});
})
