function serialize(obj) {
    var result = '';
    for (var key in obj) {
        if (result === '') {
            result += key + '=' + obj[key];
        } else {
            result += '&' + key + '=' + obj[key];
        }
    }
    return result;
}

function ajax(options) {
    var xhr = new XMLHttpRequest();
    var qs = options.qs;
    if (qs) {
        var str = '?';
        for (var key in qs) {
            if (str === '?') {
                str += key + '=' + qs[key];
            } else {
                str += '&' + key + '=' + qs[key];
            }
        }
        options.url += str;
    }
    xhr.open(options.method, options.url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (/^2\d{2}/.test(xhr.status) || xhr.status === 304)) {
            QZONE.FP.showMsgbox('删除' + +'条说说成功')
        }
    }
    xhr.send(serialize(options.data))
}

function deleteMsg() {
    var data = _preloadCache;
    var url = 'https://user.qzone.qq.com/proxy/domain/taotao.qzone.qq.com/cgi-bin/emotion_cgi_delete_v6';
    var g_tk = window.g_tk;
    var qzonetoken = top.g_qzonetoken;
    var hostuin = MOOD.env.loginUin;
    var t1_source = 1;
    var code_version = 1;
    var format = 'fs';
    var qzreferrer = 'https://user.qzone.qq.com/' + hostuin + '/infocenter?via=toolbar&_t_=';
    var tid = '';
    for (var item of data.msglist) {
        tid = item.tid;
        QZONE.FP.showMsgbox('删除' + data.num + '条说说成功')
        (function(opt) {
            opt.qzreferrer += Math.random();
            ajax(opt);
        })({
            url: url,
            method: 'POST',
            qs: {
                qzonetoken: qzonetoken,
                g_tk: g_tk,
            },
            data: {
                hostuin: hostuin,
                tid: tid,
                t1_source: t1_source,
                code_version: code_version,
                format: format,
                qzreferrer: qzreferrer,
            }
        })
    }
    getMsgList(_preloadCache.total, deleteMsg);
}

function getMsgList(num, cb) {
    if (!num) {
        num = 20;
    }
    var preloadcgi = (function() {

        var realUin = top.QZONE && top.QZONE.FP && top.QZONE.FP.getQzoneConfig && (top.QZONE.FP.getQzoneConfig('loginUin') > 0 || (top.QZONE.FP.getQzoneConfig('loginUin') + '').length > 4) && top.QZONE.FP.getQzoneConfig('loginUin');
        var loginUin = realUin || MOOD.env.getLoginUin();
        var queryUin = MOOD.env.uin
        //统一都直接进我的说说
        var tab = MOOD.env.tab;
        var params = OOP.tpl.filter(MOOD.util.getHttpParams('params')).split(',');
        var action = MOOD.env.action
        //var actionParams = MOOD.util.getHttpParams('poster');
        var tid = MOOD.env.tid,
            t1_source = MOOD.env.t1_source;
        var basePath;
        var token;
        if (window.g_sdms['taotao.qq.com'] || window.g_sdms['taotao.qzone.qq.com']) {
            basePath = g_proto + '//taotao.{{host}}';
            token = QZONE.FP.getACSRFToken('http://taotao.qzone.qq.com');
        } else {
            basePath = g_proto + '//taotao.{{host}}';
            token = QZONE.FP.getACSRFToken('http://taotao.qq.com');
        }
        window.g_tk = token;
        //var mine_tpl = '//{{location}}taotao.{{host}}/cgi-bin/emotion_cgi_msglist_v6?uin={{uin}}&ftype=0&sort=0&pos=0&num=20&replynum=100&g_tk={{token}}&callback=_preloadCallback&code_version=1&format=jsonp';
        var mine_tpl = basePath + '/cgi-bin/emotion_cgi_msglist_v6?uin={{uin}}&ftype=0&sort=0&pos=0&num=' + num + '&replynum=100&g_tk={{token}}&callback=_preloadCallback&code_version=1&format=jsonp&need_private_comment=1';

        var timer_tpl = basePath + '/cgi-bin/emotion_cgi_timershuoshuolist_v6?uin={{uin}}&pos=0&num=' + num + '&hostuin={{uin}}&g_tk={{token}}&callback=_preloadCallback&code_version=1&format=jsonp';

        var detail_tpl = basePath + '/cgi-bin/emotion_cgi_msgdetail_v6?uin={{uin}}&tid={{tid}}&t1_source={{t1_source}}&ftype=0&sort=0&pos=0&num=' + num + '&g_tk={{token}}&callback=_preloadCallback&code_version=1&format=jsonp&need_private_comment=1';
        var hot_tpl = '//{{siDomain}}/qzone_v6/act/hotTopic/top20_{{random}}.js';

        var cgi_tpl = '';

        switch (tab) {

            case 'mine':
                cgi_tpl = mine_tpl;
                break;
            case 'schedule':
                cgi_tpl = timer_tpl;
                break;
            case 'detail':
                cgi_tpl = detail_tpl;
                break;

        }
        var url = OOP.tpl.format(cgi_tpl, {
            siDomain: top.siDomain,
            host: document.domain,
            uin: OOP.tpl.html(queryUin),
            loginUin: MOOD.env.loginUin,
            tid: OOP.tpl.html(tid),
            t1_source: OOP.tpl.html(t1_source),
            random: Math.floor(Math.random() * 25),
            token: token,
            location: location
        });

        return url;
    })()

    var appendScript = function(src) {

        var stag = document.createElement('script');
        stag.type = "text/javascript";
        stag.src = src;
        document.body.appendChild(stag);
        stag = null;
    }

    var onPreloadFinished = function() {

        timeStampsPool[3] = (new Date()); //开始渲染首屏页面

        //把详情页数据变成数组
        if (MOOD.env.tab == 'detail' && window._preloadCache.code === 0) {
            window._preloadCache = MOOD.getDetailSuc(window._preloadCache);
        }


        MOOD.render(window._preloadCache);
        var onlyfirstscreen = false;
        var proxyoff = false;
        try {
            onlyfirstscreen = top.location.href.indexOf('onlyfirstscreen=1') > -1;
            var proxyoff = top.location.href.indexOf('proxyoff=1') > -1;
            if (proxyoff) {
                QZONE.FP._t.QZFL.config.xhrProxyEnable = function() { return 0; }
            }
        } catch (err) {}

        timeStampsPool[4] = (new Date()); //渲染首屏完成
        // debug mode switch
        var debugMode = false;
        if (top.location.href.indexOf('concat_debug_on') > -1) {
            debugMode = true;
        }
        var scriptsTmpl = [
            '<%for(var i=0;i<scripts.length;i++){%>',
            '   ' + (window.g_cdn_proto || location.protocol) + '//<%=siDomain%><%=scripts[i]%>?max_age=<%=maxAge%>&ver=<%=jsVer%>',
            '<%}%>'
        ].join('');
        //基础库，n久不变的，可做长cache
        var libScripts = [];
        libScripts.push('/ac/qzfl/appclientlib.js');
        libScripts.push('/qzone/app/controls/pager/pager.js');
        //业务库，经常变化，cache时间尽量短
        var businessScripts = [];
        businessScripts.push('/qzone/app/utils/requirejSolution_1.0_qzone.js');
        businessScripts.push('/qzone/v8/core/seajs_config.js');
        businessScripts.push('/qzone/app/mood_v6/script/app_patch.js');
        businessScripts.push('/qzone/app/mood_v6/script/index.js');

        appendScript(tmpl(scriptsTmpl, {
            siDomain: siDomain,
            scripts: (['/c/=' + libScripts.join(',')]),
            jsVer: 20130607,
            maxAge: 999999

        }));

        if (debugMode) {
            for (var i = 0; i < businessScripts.length; i++) {
                appendScript(tmpl(scriptsTmpl, {
                    siDomain: siDomain,
                    scripts: ([businessScripts[i]]),
                    jsVer: MOOD.version,
                    maxAge: 999999
                }))
            }
        } else {
            appendScript(tmpl(scriptsTmpl, {
                siDomain: siDomain,
                scripts: (['/c/=' + businessScripts.join(',')]),
                jsVer: MOOD.version,
                maxAge: 999999
            }))
        }

        timeStampsPool[5] = (new Date()); //渲染首屏完成  

    };

    var _loader = new top.QZFL.JSONGetter(preloadcgi, void(0), null, "utf-8");
    _loader.onSuccess = function(o) {
        window._preloadCache = o;
        window.nowMsgNum = _preloadCache.total;
        if (cb) {
            var lastNum = totalMsgNum - nowMsgNum;
            if (lastNum > 0 || totalMsgNum > 0) {
                QZONE.FP.showMsgbox('共有' + totalMsgNum + '条说说，已删除' + lastNum + '条，还有' + totalMsgNum + '条');
                return cb();
            } else {
                QZONE.FP.showMsgbox('删除完成！');
                return window.location.reload();
            }
        }
        if (isFirst) {
            window.totalMsgNum = _preloadCache.total;
            QZONE.FP.showMsgbox('共有' + totalMsgNum + '条说说，现在开始删除。。。');
            window.isFirst = false;
            return getMsgList(_preloadCache.total, deleteMsg);
        }
    };
    _loader.send("_preloadCallback");
}
window.isFirst = true;
window.totalMsgNum = 0;
window.nowMsgNum = 0;
getMsgList();