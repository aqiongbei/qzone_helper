console.log('content js loaded');

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
    window.base_info = utils.getBaseInfo();
    window.stop_task = false;
    window.tip_queue = [];
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
    preCheck();
    init();
    if (opt.type == 'stop_all') {
        window.stop_task = true;
        utils.showTips(`终止任务成功!`, 'succeed')
        return;
    }
    utils.showTips(`开始处理 < ${TASK_TYPE[opt.type].name} > 任务`)
    switch (opt.type) {
        case TASK_TYPE.export_talk.key:
            TASK.talk.export();
            break;
        case TASK_TYPE.delete_talk.key:
            TASK.talk.delete();
            break;
        case TASK_TYPE.export_comment.key:
            TASK.comment.export();
            break;
        case TASK_TYPE.delete_comment.key:
            TASK.comment.delete();
            break;
        default :
            utils.showTips(`暂不支持 < ${TASK_TYPE[opt.type].name} > 任务`);
            break;
    }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('content.js recive msg:', message, sender);
    sendResponse({is_recive: true, orion: 'content.js'});
    try {
        dispatch(message);
    } catch (e) {
        console.log(e);
    }
})
