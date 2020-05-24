console.log('comment.js loaded')
if (!window.TASK) {
    window.TASK = {};
}
window.TASK.comment = {
    getComment (opt, cb) {
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
        utils.request(config, function (res) {
            utils.showTips(`获取留言列表成功! 当前进度: ${window.comment_list.length} / ${res.data.total}`);
            cb && cb(res);
        });
    },
    deleteComment () {
        let list = window.comment_list.splice(0, 1);
        list.map(comment => {
            if (!comment.id) return;
            utils.request({
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
                    utils.showTips(`删除留言${comment.id}成功!`);
                } else {
                    // 删除失败的再回收一下
                    window.comment_list.push(comment);
                    utils.showTips(`删除留言${comment.id}失败:\n${res}!`);
                }
            });
        })
        utils.next( () => {
            setTimeout( () => {
                if (window.comment_list && window.comment_list.length) {
                    this.deleteComment();
                } else {
                    this.delete();
                }
            }, 5000);
        })
    },
    delete () {
        let foo = res => {
            if (res.data && res.data.total) {
                window.comment_list = res.data.commentList;
                utils.next(this.deleteComment);
            } else {
                utils.showTips('删除留言完成!', 'succeed');
            }
        }
        this.getComment(null, foo);
    },
    export () {
        let foo = res => {
            console.log('cb', res)
            if (res.data && res.data.commentList) {
                window.comment_list = window.comment_list.concat(res.data.commentList)
            }
            if (window.comment_list.length >= res.data.total) {
                utils.download(JSON.stringify(window.comment_list, 4, ' '), `comment_list.json`);
                window.comment_list = [];
                utils.showTips('导出留言完成!', 'succeed');
            } else {
                let opt = {
                    qs: {
                        start: window.comment_list.length
                    }
                }
                utils.next( (opt, foo) => {
                    this.getComment(opt, foo);
                })
            }
        }
        this.getComment(null, foo);
    }
}
