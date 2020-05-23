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
	            console.log(xhr);
	        }
	    }
	    xhr.send(serialize(options.data))
	}

	function postMsg() {
	    if (window.g_sdms['taotao.qq.com'] || window.g_sdms['taotao.qzone.qq.com']) {
	        var g_tk = QZONE.FP.getACSRFToken('http://taotao.qzone.qq.com');
	    } else {
	        var g_tk = QZONE.FP.getACSRFToken('http://taotao.qq.com');
	    }
	    var url = 'https://user.qzone.qq.com/proxy/domain/taotao.qzone.qq.com/cgi-bin/emotion_cgi_publish_v6';
	    var qzonetoken = top.g_qzonetoken;
	    var syn_tweet_verson = 1;
	    var paramstr = 1;
	    var pic_template = '';
	    var richtype = '';
	    var richval = '';
	    var special_url = '';
	    var subrichtype = '';
	    var con = 0;
	    var feedversion = 1;
	    var ver = 1;
	    var ugc_right = 1;
	    var to_sign = 0;
	    var hostuin = MOOD.env.loginUin;
	    var code_version = 1;
	    var format = 'fs';
	    var qzreferrer = 'https://user.qzone.qq.com/' + hostuin + '/main';
	    for (var i = 10; i < 30; i++) {
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
	                syn_tweet_verson: syn_tweet_verson,
	                paramstr: paramstr,
	                pic_template: pic_template,
	                richtype: richtype,
	                richval: richval,
	                special_url: special_url,
	                subrichtype: subrichtype,
	                con: i * 10000,
	                feedversion: feedversion,
	                ver: ver,
	                ugc_right: ugc_right,
	                to_sign: to_sign,
	                hostuin: hostuin,
	                code_version: code_version,
	                format: format,
	                qzreferrer: qzreferrer,
	            }
	        })
	    }
	}

	postMsg();