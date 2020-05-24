var MSG = {
    global: {
        //逻辑
        total: 0,
        isBatchMode: false,
        allowComment: true,
        auditOn: false,
        auditNum: 0
    },

    /**
     * 留言板常量
     */
    CONST: {
        //域名、路径部分
        IMGCACHE_DOMAIN: parent.imgcacheDomain,
        CGI_MSGBOARD_DOMAIN: parent.g_MsgBoard_Domain,

        //约定部分
        MSG_TYPE_HINT: 0,
        MSG_TYPE_SUCC: 4,
        MSG_TYPE_ERROR: 5,
        MSG_TYPE_LOADING: 6,

        //逻辑部分
        MAX_COMMENT_LENGTH: 4000, // dariondiao 20141029 改成2000汉字（4000字节）
        MAX_AUTHORMSG_LENGTH: 1536
    },

    /**
     * 更新页面视图
     */
    updatePageView: function() {
        //主人态显示不同的"缺省留言"
        //这块class去了
        // if(oData.authorInfo && !oData.authorInfo.htmlMsg && $('author_info_ownmode')){
        // 	if(IS_OWNER){
        // 		$('author_info_ownmode').className = '';
        // 	} else {
        // 		$('author_info_guestmode').className = '';
        // 	}
        // }

        //主人态不显示送礼入口
        if (IS_OWNER) {
            $('popupGiftBtn').style.display = 'none';
        }

        //名博、商博、认证空间不显示头像
        if (IS_STAR || IS_BIZ || IS_CERTIFIED) {
            QZFL.css.addClassName($("ulCommentList"), "list_without_avatar");
        }


        //认证空间
        if (IS_CERTIFIED) {
            if ($("btnAddEssenceBatch")) {
                $("btnAddEssenceBatch").style.display = '';
            }
            if ($("btnAddEssenceBatchBottom")) {
                $("btnAddEssenceBatchBottom").style.display = '';
            }
        }

        //主人态
        if (IS_OWNER) {
            //[留言板设置]
            var setBtn = $('btnToSet');
            var setList = $e('ul.sub_list', setBtn.parentNode).elements[0];
            QZFL.css.removeClassName(setBtn, 'none');
            QZFL.event.addEvent(setList, 'mouseout', function() {
                setList.style.display = 'none';
            });
            QZFL.event.addEvent(setBtn, 'mouseover', function() {
                setList.style.display = '';
            });
            QZFL.event.addEvent(setList, 'mouseover', function() {
                setList.style.display = '';
            })

            $e('.comments_set .sub_list li>a').each(function(a) {
                QZFL.event.addEvent(a, 'mouseover', function() {
                    QZFL.css.addClassName(this.parentNode, 'bg2');
                });
                QZFL.event.addEvent(a, 'mouseout', function() {
                    QZFL.css.removeClassName(this.parentNode, 'bg2');
                });
            });

            //[开启留言审核]
            if (MSG.global.auditOn) {
                QZFL.css.removeClassName($('btnGotoAudit'), 'none');
            }

            $('signCheckLabel').title = '勾选后显示用户签名档';
            $('signCheck').checked = false;
            var isDebug = false;
            try {
                isDebug = top.location.href.indexOf('debug=1') > -1
            } catch (err) {}
            var now = isDebug ? new Date() : QZONE.FP.getSvrTime();
            if (now.getTime() < new Date(1396470600000).getTime() && now.getTime() > new Date(1396467000000).getTime()) {
                $("cheatHintArea").innerHTML = '<strong class="icon_hint"><span>提示</span></strong><span>尊敬的QQ空间用户：为提升服务器的稳定运行，提高产品质量，我司将于2014年4月3日(周四) 3:30~4:30对服务器进行更新维护，期间留言板操作将受到影响。为此给您带来的不便，我们深表歉意。<a href="http://kf.qq.com/faq/130926meqeyA14040226v6Bj.html" target="_blank">点此了解详情</a></span><a href="javascript:;" onclick="$(\'cheatHintArea\').style.display=\'none\';return false;" title="关闭提示" class="hint_close">关闭</a>';
                $e("#cheatHintArea").show();
            } else {
                //挂个维护公告
                if (IS_CERTIFIED) {
                    $("cheatHintArea").innerHTML = '<strong class="icon_hint"><span>提示</span></strong><span>温馨提示，您是尊贵的认证空间用户，您可以选择置顶留言显示在最前面和用户分享。</span><a href="javascript:;" onclick="$(\'cheatHintArea\').style.display=\'none\';return false;" title="关闭提示" class="hint_close">关闭</a>';
                    $e("#cheatHintArea").show();
                } else if (!IS_STAR && !IS_BIZ) {
                    $("cheatHintArea").innerHTML = '<strong class="icon_hint"><span>提示</span></strong><span>留言板已默认为大家开启了非好友留言的主人审核功能，查看、保护隐私都由自己来决定！提高网络安全防范意识，保护号码使用安全，<a href="http://kf.qq.com/faq/120227U7vmAf150429bAZ7fI.html" rel="prevent_cheat" target="_blank">近期安全工作请点此了解！</a></span><a href="javascript:;" onclick="$(\'cheatHintArea\').style.display=\'none\';return false;" title="关闭提示" class="hint_close">关闭</a>';
                    $e("#cheatHintArea").show();
                }
            }

        }

        //名博、商博、认证空间
        if (IS_STAR || IS_BIZ || IS_CERTIFIED) {
            $('useSign').style.display = 'none';
        }
    },

    /**
     * 送礼物入口
     * @param  {Number} uin
     * @param  {Number} pos
     */
    sendGift: function(uin, pos) {
        QZONE.FP.sendGift(uin);

        var tc = QZONE.FP.getStatPackage();
        switch (pos) {
            //留言框上方
            case 0:
                tc.hotClick('isd.qzonegift.pay.pay-wall1', 'mall.qzone.qq.com', location.pathname);
                break;
                //留言项右侧操作项
            case 1:
                tc.hotClick('isd.qzonegift.pay.pay-wall2', 'mall.qzone.qq.com', location.pathname);
                break;
        }
    },

    bindPageEvent: function() {
        var _this = this;
        QZFL.event.addEvent($('sendGift'), 'click', function() {
            _this.sendGift(SPACE_UIN, 0);
        });

        QZFL.event.addEvent($('privCheckLbl'), 'mousedown', function(e) {
            if (!QZONE.FP.isVipUser(true)) {
                QZFL.event.preventDefault(e);

                return false;
                //show need vip tip
            }
        });
    },

    /**
     * 页面启动器
     * 初始化页面数据
     * @param {Object} o 页面初始化数据（第一屏数据）
     * @return {Boolean} 是否使用初始化数据加载
     */
    pageStart: function(oData) {
        //[fix] 没有登录态getRemarkList不调用回调
        if (LOGIN_UIN) {
            QZONE.FP.getRemarkList && QZONE.FP.getRemarkList(function(d) { MSG.util.setRemark(d) });
        }

        //基础数据处理
        MSG.global.auditOn = oData.auditON;
        MSG.global.auditNum = oData.auditNum;

        //显示页面元素
        this.updatePageView();
        this.bindPageEvent();

        QZBlog.Util.Statistic.sendPV("msgboard", "msg.qzone.qq.com"); //上报PV
        MSG.util.nameCard.loadScript(); //异步加载个人名片
    }
};

(function() {
    var _um = {
        "main": "get_msgb",
        "page": "get_msgb",
        "modifyinfo": "mod_hostword",
        "modifymsg": "mod_msgb",
        "delcomment": "del_reply",
        "delanswer": "del_msgb",
        "commentanswer": "add_reply",
        "addanswer": "add_msgb",
        "setAudit": "msgb_verify_switch.cgi",
        "addessence": "add_essence",
        "delessence": "del_msgb"
    }

    var _remark = {};

    MSG.util = QZFL.object.extend(MSG.util, {
        getUrl: function(key) {
            return "http://m.qzone.qq.com/cgi-bin/new/" + _um[key];
        },

        getRemark: function(uin, nick) {
            return (_remark[uin] && escHTML(_remark[uin])) || nick || uin;
        },

        setRemark: function(d) {
            _remark = d;
            _remark[LOGIN_UIN] = "我";
        },
        speedReport: function(oData) {
            var url = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=175" + "&flag2=113" + "&flag3=1" +
                "&flag4=0" + "&flag5=0" + "&uin=" + SPACE_UIN + "&hh=" + Math.random();
            for (var index in oData) {
                url += "&" + index + "=" + (oData[index] - parent.mgbBasePoint);
            }
            var img = new Image();
            setTimeout(function() { img.src = url; }, 1000);
        },

        nameCard: {
            loaded: false,
            loadScript: function() {
                var g_oJSLoader = new QZONE.jsLoader();
                g_oJSLoader.onload = QZONE.event.bind(this, function() {
                    MSG.util.nameCard.loaded = true;
                });
                g_oJSLoader.load("http://" + MSG.CONST.IMGCACHE_DOMAIN + "/qzone/v5/namecardv2.js", document, "utf-8");
            },
            init: function(container) {
                if (!this._checkReady(QZFL.event.bind(this, "init", container))) {
                    return;
                }
                setTimeout(function() {
                    QZONE.namecard.init(container);
                    //try{QZONE.namecard.init(container);}catch(err){}
                }, 2000);
            },
            _checkReady: function(callback) {
                if (!MSG.util.nameCard.loaded) {
                    setTimeout(QZONE.event.bind(null, callback), 500);
                    return false;
                }
                return true;
            }
        },

        //滚动特效
        scrollTo: function(elem, callback) {
            var endHeight;
            if (QZONE.FP.getQzoneConfig().full) {
                endHeight = QZFL.dom.getPosition(elem).top +
                    QZFL.dom.getPosition(QZONE.FP.getCurrentAppWindow().frameElement).top - 30;
            } else {
                endHeight = QZFL.dom.getPosition(elem).top;
            }
            var _doc = QZONE.FP.getQzoneConfig().full ? parent.document : document;
            var _elem = _doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"];
            var scrollTween = setInterval(function() {
                if (_elem.scrollTop > endHeight) {
                    _elem.scrollTop -= 100;
                } else {
                    clearInterval(scrollTween);
                    scrollTween = null;
                    callback && callback();
                }
            }, 10);
        },

        // 内容特效
        ContentProperty: function(content) {
            var UBBTAGS = {
                "image": /\[img\]http(.[^\]]*)\[\/img\]/ig,
                "imagesize": /\[img,(\d{1,4}),(\d{1,4})\]http(.[^\]]*)\[\/img\]/ig,
                "music": /\[music\]http(.[^\]]*)\[\/music\]/ig,
                "qqshow": /\[qqshow,(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})(,.*?|)\]http(.[^\]]*)\[\/qqshow\]/ig
            };
            this._strContent = content;
            this._parseContent = function() {
                for (var tag in UBBTAGS) {
                    this[tag] = this._checkUbbTagsCnt(UBBTAGS[tag]);
                }
            };
            this._checkUbbTagsCnt = function(reg) {
                var count = 0;
                while ((reg.exec(this._strContent)) != null) {
                    ++count;
                }
                return count;
            };
            this._parseContent();
        },

        /**
         * 获取用户信息
         * @deprecated 这个方式是为了兼容 QZONE.FP.getPortraitList的错误
         * @param  {Array}   uinList  用户号码清单
         * @param  {Function} callback 成功回调
         */
        getPortraitInfo: function(uinList, callback) {
            var ret = false;
            var cb = function(rawData) {
                if (!ret) {
                    callback(rawData);
                }
            };
            var rawData = QZONE.FP.getPortraitList(uinList, cb, { "needScore": 1, "needVIP": 1 });
            if (rawData) {
                setTimeout(function() {
                    callback(rawData);
                }, 0);
                ret = true;
            }
        }
    });
})();

//头像加载完毕 => 辅助页面数据处理完毕
try {
    parent.mgbSpeedPoint[5] = new Date().getTime();
} catch (e) {}

//页面测速上报
try {
    if (parent.mgbSpeedPoint && !window.isAjaxMode) {

        setTimeout(function() {
            MSG.util.speedReport(parent.mgbSpeedPoint);
            parent.mgbSpeedPoint = null;
            parent.mgbBasePoint = null;
        }, 1000);
        if (!window._o_t) {
            QZBlog.Util.Statistic.sendPV('/static_msgb/getmsg_timeout', "taotaoact.qzone.qq.com");
        } else if (window._o_t >= 3000 && window._o_t <= 5000) {
            QZBlog.Util.Statistic.sendPV('/static_msgb/getmsg_gt_3s', "taotaoact.qzone.qq.com");
        } else if (window._o_t > 5000) {
            QZBlog.Util.Statistic.sendPV('/static_msgb/getmsg_gt_5s', "taotaoact.qzone.qq.com");
        }
    }
} catch (err) {}(function(MSG) {
    var _PAGE_DATA = {};
    var _CUR_EDIT_COMMENT_IDX;
    var _BATCH_MODE = false;
    var PAGE_SIZE = PAGE_SIZE || 10;
    var COMMENT_MODULE_COLL = {};

    // sigh......
    window._originalConfirm = window.confirm;
    window.confirm = function(str) {
        if (str == "确定要删除该评论么？") {
            return window._originalConfirm("确定要删除该回复么？");
        }
        if (str == "您确认要放弃正在编辑的评论吗？") {
            return true;
        }
        return window._originalConfirm(str);
    };

    /**
     * 初始化
     * @return {[type]} [description]
     */
    var _initReplyComponent = function(callback) {
        QZFL.imports('/qzone/app/snslib/widget/commentModule/commentModule_1.1.js', function() {
            SNSLib.jsMVC = new function() {
                var $u = new function() {
                    this.capitalize = function(string) {
                        return [
                            string.charAt(0).toUpperCase(),
                            string.substring(1, string.length)
                        ].join('');
                    };
                };
                this.Model = function() {};
                this.Model.prototype = new function() {
                    this.genProperties = function() {
                        var model = this;
                        for (var i = arguments.length - 1; i >= 0; i--) {
                            var property = arguments[i];
                            var capitalized = $u.capitalize(property);
                            new function() {
                                var filedName = ['_', property].join('');
                                var getterName = ['get', capitalized].join('');
                                var setterName = ['set', capitalized].join('');
                                model[getterName] = function() {
                                    return this[filedName];
                                };
                                model[setterName] = function(value) {
                                    this[filedName] = value;
                                };
                            }
                        }
                    };
                    this.setProperties = function(values) {
                        if (values) {
                            for (var i in values) {
                                var setMethod = this['set' + $u.capitalize(i)];
                                if (setMethod) {
                                    var value = values[i];
                                    if (value && value.modelName) {
                                        value = new(eval(value.modelName))(value);
                                    }
                                    setMethod.call(this, value);
                                }
                            }
                        }
                    };
                };
            };

            SNSLib.Reply = function(values) {
                this.setProperties(values);
            };
            SNSLib.Reply.prototype = new SNSLib.jsMVC.Model();
            SNSLib.Reply.prototype.genProperties('id', 'content', 'poster', 'postTime', 'orginalTime');

            SNSLib.User = function(values) {
                this.setProperties(values);
            };
            SNSLib.User.prototype = new SNSLib.jsMVC.Model();
            SNSLib.User.prototype.genProperties('uin', 'nickname', 'avatarUrl');

            SNSLib.selfConfig = {
                showRepliesByDefault: false,
                showPaginationForm: false,
                emoticonSupported: true,
                maxCommentLength: 2000, //dariondiao 20141031 放宽留言板回复字数到2000
                avatarTemplate: '<a href="http://user.qzone.qq.com/${uin}" target="_blank" link="nameCard_${uin}" class="q_namecard"><img src="${avatarUrl}" style="width:35px; height:35px;" name="portraitImg_${uin}" alt="${nickname}" /></a>',
                commentTemplate: '<div id="${id}_comment_${comment.id}_contentBlock" class="mod_comment_cont"><p class="mod_comment_avatar">${avatarImage}</p><div class="comment_cont"><p><span class="mod_comment_authorname"><a id="${id}_comment_${comment.id}_poster_nickname" link="nameCard_${comment.poster.uin}" name="msg_link_${comment.poster.uin}" href="${userLinkUrl}" target="${userLinkTarget}" class="c_tx q_namecard">${comment.poster.nickname}</a></span> ${comment.content}</p><p class="mod_comment_last"><span class="c_tx3 mod_comment_time">${comment.postTime}</span> <a id="${id}_comment_${comment.id}_replyBoxToggle" href="javascript:;" class="c_tx" style="display:none;">回复</a> <a id="${id}_comment_${comment.id}_removeButton" href="javascript:;" class="c_tx mod_comment_del" style="display:none;">删除</a></p></div></div><div id="${id}_comment_${comment.id}_replyListContainer" class="mod_comment_reply" style="display:none;"><div id="${id}_comment_${comment.id}_replyListWrapper"><ol id="${id}_comment_${comment.id}_replyList"></ol><div id="${id}_comment_${comment.id}_replyBox" class="mod_comment_post" style="display:none;"><p id="${id}_comment_${comment.id}_emoticonButtonWrapper"><a id="${id}_comment_${comment.id}_emoticonButton" title="表情" class="bg_img mod_comment_emoticons">表情</a></p><p class="mod_comment_textarea"><span><textarea id="${id}_comment_${comment.id}_content" cols="60" rows="5" class="textarea"></textarea></span></p><p id="${id}_comment_${comment.id}_hintBox" class="hint" style="display:none;"><span class="icon_hint">提示：</span><span id="${id}_comment_${comment.id}_hint"></span></p><p class="mod_comment_option"><span class="mod_comment_sub"><button type="button" id="${id}_comment_${comment.id}_postButton" class="bt_tx2">确定</button><a id="${id}_comment_${comment.id}_cancelButton" href="javascript:;" title="取消" class="c_tx3">取消</a></span><span class="c_tx3 mod_comment_other"><span id="${id}_comment_${comment.id}_currentLength"></span>/<span id="${id}_comment_${comment.id}_maxLength"></span></span></p></div></div></div>'
            };
            callback();
        });
    }

    /**
     * 显示单条回复信息评论组件
     * @param  {Object} data
     */
    var _showCommentItemReply = function(aItem) {
        //没有回复列表、或者项目为置顶项目不加载评论回复组件
        if (!aItem.replyList || aItem.isEsscence) {
            return;
        }

        if (!window.SNSLib) {
            _initReplyComponent(function() { _showCommentItemReply(aItem); });
            return;
        }

        window.SNSLib.selfConfig.id = "commentModule" + aItem.id;
        var commentModule = COMMENT_MODULE_COLL[aItem.id] = new SNSLib.widget.CommentModule(window.SNSLib.selfConfig);
        var replylist = aItem.replyList;

        commentModule.loadComments = function(callbacks, pageNum) {
            this.answerid = aItem.id;

            if (!replylist.length) {
                callbacks.onSuccess([]);
                return;
            }

            var uinList = (function() {
                var _ls = [];
                QZFL.each(replylist, function(reply) {
                    _ls.push(reply.uin);
                });
                return _ls;
            })();

            MSG.util.getPortraitInfo(uinList, function(rawData) {
                var arrReply = [];
                QZFL.each(replylist, function(item, idx) {
                    var nickname = rawData[item.uin] ? rawData[item.uin][6] : item.uin;
                    var user = new SNSLib.User({
                        "uin": item.uin,
                        "nickname": QZFL.string.restHTML(MSG.util.getRemark(item.uin, nickname)),
                        "avatarUrl": QZONE.FP.getPURL(item.uin, 30)
                    });
                    var content = parseMentionFormat(item.content, true);
                    var reply = new SNSLib.Reply({
                        "uin": item.uin,
                        id: aItem.id + "_" + idx,
                        content: content,
                        poster: user,
                        orginalTime: item.time,
                        postTime: item.time ? QZFL.string.timeFormatString(item.time * 1000, "{Y}-{M}-{d} {h}:{m}") : ''
                    });
                    arrReply.push(reply);
                });
                callbacks.onSuccess(arrReply);
            });
        };
        commentModule.isAbleToReply = function(comment) {
            return false;
        };
        commentModule.isAbleToRemove = function(comment) {
            var uin = comment.getPoster().getUin();
            if (IS_OWNER || uin == LOGIN_UIN) {
                return true;
            }
            return false;
        };
        commentModule.onError = function(code, data) {
            switch (code) {
                case 'comment-too-long':
                case 'reply-too-long':
                    alert('回复内容过长');
                    break;
                case 'comment-no-content':
                case 'reply-no-content':
                    alert('请输入回复内容');
                    break;
            }
        };

        commentModule.postComment = (QZONE.event.bind(this, function(module) {
            return QZONE.event.bind(this, function(content, callbacks) {
                _doReply(module, content, callbacks);
            });
        }))(commentModule);

        commentModule.removeComment = function(comment, handle) {
            MSG.list.removeCommentReply(this.answerid, comment.getPoster().getUin(), comment.getOrginalTime(), handle);
        };

        commentModule.init($("divComment_" + aItem.id));
        $("divComment_" + aItem.id).style.display = (replylist.length > 0 ? "" : "none");
        QZFL.css[replylist.length ? 'removeClassName' : 'addClassName']($("divComment_" + aItem.id + '_line'), 'none');

        var bAllowReplyFlag = false;
        if ((IS_OWNER || (replylist.length && aItem["uin"] == LOGIN_UIN)) //主人态或者是自己发的留言并且主人回复了
            &&
            MSG.global.allowComment &&
            !(IS_STAR && aItem["uin"] == LOGIN_UIN && !IS_OWNER)
        ) { //确认了一下名博也可以主人回复，但限制客人回复
            bAllowReplyFlag = true;
        }
        if (!bAllowReplyFlag) {
            QZFL.css.addClassName($("pLi_" + aItem.id), 'hide_comment_tip');
        }
    };


    /**
     * 回复留言
     * @param  {Object} commentModule 评论组件
     * @param  {String} content       回复内容
     */
    var _doReply = function(commentModule, content) {
        var data = {
            hostUin: SPACE_UIN,
            msgId: commentModule.answerid,
            format: 'jsonp',
            content: content,
            uin: LOGIN_UIN
        };
        var url = MSG.util.getUrl("commentanswer")
        var Request = new QZBlog.Util.NetRequest({ url: url, data: data, method: 'post', charset: 'utf-8', uniqueCGI: true });
        Request.onSuccess = function(responseData) {
            QZONE.FP.showMsgbox("操作成功!", MSG.CONST.MSG_TYPE_SUCC, 2000);
            var replyInfo = {
                uin: LOGIN_UIN,
                content: content,
                time: responseData.data.replytime
            };
            var commentInfo = MSG.list.getItemDataByCommentId(commentModule.answerid);
            commentInfo["replyList"].push(replyInfo);
            _showCommentItemReply(commentInfo);
        }
        Request.send();
    };

    /**
     * 留言板列表模块
     */
    var MSG_LIST = {
        showPage: function(pageIndex) {
            if (pageIndex === undefined) {
                pageIndex = CUR_PAGE_INDEX;
            }
            var reportTag = '';
            if (pageIndex) {
                pageIndex > CUR_PAGE_INDEX ? (reportTag = 'next_page') : (reportTag = 'prev_page');
            }
            CUR_PAGE_INDEX = pageIndex;
            var _this = this;
            this.getPageData(pageIndex, function(data) {
                if (!data.total && pageIndex > 1) {
                    _this.showPage(pageIndex - 1);
                    return;
                }
                $("ulCommentList").innerHTML = tmpl(MSG_LIST_TPL, data);
                _this.bindMenuEvent();
                procCommentArea();
                _this.showUserExtractInfo(data.items);
                for (var i = 0; i < data.items.length; i++) {
                    _showCommentItemReply(data.items[i]);
                }
                _this.showPagination(pageIndex, data.total);
                _this.updatePageView();
                MSG.util.scrollTo($('pager_top'));
                EditCommentEditor.resetInstanceCollection();
                MSG.Signature.toggleSignature();
                if (reportTag) {
                    QZBlog.Util.Statistic.sendPV(reportTag, "msg.qzone.qq.com");
                }

            })
        },

        /**
         * 拉取页面留言数据
         * @param  {Number}   pageIndex 页码
         * @param  {Function} callback
         */
        getPageData: function(pageIndex, callback) {
            var flag = false;
            var _data = {
                uin: LOGIN_UIN,
                hostUin: SPACE_UIN,
                num: PAGE_SIZE,
                start: PAGE_SIZE * (pageIndex - 1),
                hostword: 0,
                essence: (flag ? 0 : 1),
                r: Math.random()
            }
            var _url = MSG.util.getUrl('page');
            var Request = new QZBlog.Util.NetRequest({ url: _url, data: _data, method: 'get', charset: 'utf-8', uniqueCGI: true });
            Request.onSuccess = function(responseData) {
                _PAGE_DATA = responseData.data;
                callback(_fixPageData(responseData.data));
            };
            Request.send();
        },

        /**
         * 获取单个数据，这个数据还必须是已经load到的，否则返回null
         * @param  {Number} commentId
         * @return {Object}
         */
        getItemDataByCommentId: function(commentId) {
            for (var i = _PAGE_DATA.items.length - 1; i >= 0; i--) {
                if (_PAGE_DATA.items[i].id == commentId) {
                    return _PAGE_DATA.items[i];
                }
            }
            return null;
        },

        /**
         * 显示分页组件
         * @param  {Number} curPageIndex 页码，由1开始
         * @param  {Number} itemTotal    条数
         */
        showPagination: function(curPageIndex, itemTotal) {
            var _this = this;
            var pageTotal = !itemTotal ? 1 : Math.ceil(itemTotal / PAGE_SIZE);
            location.hash = '#page=' + curPageIndex;
            QZBlog.Util.PageIndexManager.init([$('pager_top'), $('pager_bottom')], pageTotal, curPageIndex, function(pageIndex) {
                _this.showPage(pageIndex);
            });
        },

        /**
         * 显示用户更多信息（黄钻、积分）
         * @param  {Array} commentList 评论数据
         */
        showUserExtractInfo: function(commentList) {
            var uinList = [],
                bmpMap = {};
            QZFL.each(commentList, function(comment) {
                if (comment.uin) {
                    if (!bmpMap[comment.uin]) {
                        //后台传的bitmap可能包含空白，或位数不足16位
                        comment.bmp = QZFL.string.trim(comment.bmp);
                        comment.bmp = QZFL.string.fillLength(comment.bmp, 16, '0', false);
                        bmpMap[comment.uin] = QZFL.string.trim(comment.bmp);
                        uinList.push(comment.uin);
                    }
                }
            });

            //显示黄钻等级
            QZFL.each(bmpMap, function(bmp, uin) {
                var vipHTML = QZONE.FP.getVipHTML({
                    'lv': getUserVIPLevel(bmp),
                    'isVip': isVipUser(bmp),
                    'isYearVip': isUserVIPExpress(bmp),
                    'isYearExpire': isYearVipExpire(bmp)
                }, 'l', {
                    withYear: 1,
                    className: isUserVIPExpress(bmp) ? 'year_vip' : 'normal_vip'
                });
                $e('span[rel=user_vip_info_' + uin + ']').each(function(n) {
                    QZFL.css.removeClassName(n, 'none');
                    n.innerHTML = vipHTML;
                });
            });

            //[头像url，花藤分数，头像类型，黄钻等级，黄钻分数，黄钻标识，昵称，世博]
            MSG.util.getPortraitInfo(uinList, function(rawData) {
                QZFL.each(rawData, function(data, uin) {
                    //昵称
                    /**
                    $e('span[rel=user_name_info_'+uin+']').each(function(n){
                    	var a = n.getElementsByTagName('a')[0];
                    	(a||n).innerHTML = data[6];
                    });
                    **/

                    //果子
                    var html = QZONE.FP.getQZLevelIconHTML(data[1], true, 0, { clickable: IS_OWNER });
                    var title = '等级:' + getUserGrade(data[1]) + '  积分:' + data[1];
                    $e('span[rel=user_grade_' + uin + ']').each(function(n) {
                        QZFL.css.removeClassName(n, 'none');
                        n.title = title;
                        n.innerHTML = html;
                    });
                });
            });
        },

        /**
         * 绑定菜单toggle效果
         */
        bindMenuEvent: function() {
            var toggleMenu = function(container, bShow) {
                var link = container.getElementsByTagName('A')[0];
                var mnu = container.getElementsByTagName('UL')[0];
                if (!link || !mnu || !mnu.getElementsByTagName('LI').length) {
                    return;
                }
                var floorLi = QZFL.dom.searchChain(container.parentNode, 'parentNode', function(el) {
                    return el.tagName == 'LI';
                });
                mnu.style.display = bShow ? 'block' : 'none';
                QZFL.css[bShow ? 'addClassName' : 'removeClassName'](mnu, 'list_drop_dump');
                QZFL.css[bShow ? 'addClassName' : 'removeClassName'](link, 'bg bor');
                QZFL.css[bShow ? 'addClassName' : 'removeClassName'](container, 'drop_list_current');
                QZFL.css[bShow ? 'addClassName' : 'removeClassName'](floorLi, 'list_drop_now');

            };
            $e('a.drop_list_link').onMouseOver(function(ev) {
                if (!this.parentNode.getAttribute('data-disabled')) {
                    toggleMenu(this.parentNode, true);
                }
            });
            $e('a.drop_list_link').onClick(function(ev) {
                if (!this.parentNode.getAttribute('data-disabled')) {
                    $e('li', this.parentNode).each(function(li) {
                        if (!QZFL.css.hasClassName(li, 'none')) {
                            var a = $e('a', li).elements[0];
                            if (a) {
                                a.focus();
                            }
                            return false;
                        }
                    })
                    toggleMenu(this.parentNode, true);
                }
            });
            $e('li.drop_list').onMouseLeave(function(ev) {
                toggleMenu(this, false);
            });
            $e('li.drop_list ul').onClick(function(ev) {
                toggleMenu(this.parentNode, false);
            });
            $e(".drop_list li a").onHover(function() { $e(this).addClass("bg2"); }, function() { $e(this).removeClass("bg2"); });
        },

        /**
         * 绑定页面功能按钮
         */
        bindFuncLinkEvent: function() {
            var _this = this;
            var funMap = {
                'quote': function(commentId, uin) { _this.quoteComment(commentId); },
                'addEssence': function(commentId, uin) { _this.addEssenceSingle(commentId); },
                'reply': function(commentId, uin) { _this.showReplyCommentEditor(commentId); },
                'edit': function(commentId, uin) { _this.editComment(commentId); },
                'delete': function(commentId, uin) { _this.deleteSingle(commentId); },
                'sendMsg': function(commentId, uin) { _this.sendMsg(uin); },
                'deleteEssence': function(commentId, uin) { _this.deleteEssenceSingle(commentId); },
                'report': function(commentId, uin) { _this.reportComment(commentId); },
                'moveBlack': function(commentId, uin) { _this.moveBlack(uin); },
                'sendGift': function(commentId, uin) { MSG.sendGift(uin, 1); },
                'editCommentBtn': function(commentId, uin) { _this._doModifyComment(commentId); },
                'cancelEditCommentBtn': function(commentId, uin) { _this.cancelEditComment(commentId); },
                'toggleBatchMode': function() { _this.toggleBathMode(); },
                'selectAll': function() { _this.selectAll() },
                'batchDelete': function() { _this.deleteBatch(); }
            };

            QZFL.event.addEvent(document.body, 'click', function(ev) {
                var tag = QZFL.event.getTarget(ev);
                var rel = tag.getAttribute('rel');
                var uin = tag.getAttribute('uin');
                var commentId = tag.getAttribute('commentId');

                if (!rel) {
                    return;
                }
                if (funMap[rel]) {
                    if (tag.tagName == 'A') {
                        QZFL.event.preventDefault(ev);
                    }
                    funMap[rel](commentId, uin);
                }
            })
        },

        /**
         * 发送短消息
         * @param  {Number} uin
         */
        sendMsg: function(uin) {
            return parent.showMsgSender(uin);
        },

        /**
         * 显示回复入口
         */
        showReplyCommentEditor: function(id) {
            var aItem = this.getItemDataByCommentId(id);
            $("divComment_" + aItem.id).style.display = "";
            COMMENT_MODULE_COLL[aItem.id].showCommentBox();
        },

        /**
         * 取消编辑器留言
         * @param {Number} commentId
         * @param {Boolean} destroyInstance 是否摧毁该评论绑定的编辑器实例
         */
        cancelEditComment: function(commentId, destroyInstance) {
            _CUR_EDIT_COMMENT_IDX = 0;
            $('commentContentDiv_' + commentId).style.display = '';
            $('divComment_' + commentId).parentNode.style.display = '';
            EditCommentEditor.hideEditor(commentId, destroyInstance);
        },

        /**
         * 编辑留言
         * @param  {Number} commentId
         */
        editComment: function(commentId) {
            var info = this.getItemDataByCommentId(commentId);
            if (!info) {
                return;
            }

            if (_CUR_EDIT_COMMENT_IDX && commentId != _CUR_EDIT_COMMENT_IDX && !window._originalConfirm('您正在编辑您的留言，点击“确定”将会丢失您的修改。')) {
                //放弃
            } else {
                if (_CUR_EDIT_COMMENT_IDX == commentId) {
                    return;
                }
                if (_CUR_EDIT_COMMENT_IDX && commentId != _CUR_EDIT_COMMENT_IDX) {
                    this.cancelEditComment(_CUR_EDIT_COMMENT_IDX);
                }
                _CUR_EDIT_COMMENT_IDX = commentId;
                $('commentContentDiv_' + commentId).style.display = 'none';
                $('divComment_' + commentId).parentNode.style.display = 'none';
                EditCommentEditor.showEditor(commentId, function() {
                    EditCommentEditor.setContent(commentId, info.htmlContent);
                });
            }
        },

        /**
         * 编辑留言
         * @param  {Number} commentId
         */
        _doModifyComment: function(commentId) {
            var _this = this;
            var content = EditCommentEditor.getUbbContent(commentId);
            if (content === undefined) {
                return;
            }

            var url = MSG.util.getUrl("modifymsg");
            var aid = this.getItemDataByCommentId(commentId).id;
            var data = {
                hostUin: SPACE_UIN,
                uin: LOGIN_UIN,
                msgId: aid,
                content: content,
                format: 'jsonp'
            }

            var Request = new QZBlog.Util.NetRequest({ url: url, data: data, method: 'post', charset: 'utf-8', uniqueCGI: true });
            Request.onSuccess = function(responseData) {
                QZONE.FP.showMsgbox(responseData.message || '修改成功', MSG.CONST.MSG_TYPE_SUCC, 1000);
                setTimeout(function() {
                    _this.showPage();
                }, 1000);
            };
            Request.send();
        },

        removeCommentReply: function(commentId, uin, time, handle) {
            var _this = this;
            var url = MSG.util.getUrl("delcomment");
            var data = {
                hostUin: SPACE_UIN,
                msgId: commentId,
                uin: uin,
                replyTime: time,
                format: 'jsonp'
            };
            var Request = new QZBlog.Util.NetRequest({ url: url, data: data, method: 'post', charset: 'utf-8', uniqueCGI: true });
            Request.onSuccess = function(responseData) {
                QZONE.FP.showMsgbox(responseData.message || '删除成功', MSG.CONST.MSG_TYPE_SUCC, 2000);
                handle.onSuccess();
                var replyList = _this.getItemDataByCommentId(commentId).replyList;
                for (var i = 0; i < replyList.length; i++) {
                    if (replyList[i].time == time) {
                        replyList = replyList.splice(i, 1);
                        break;
                    }
                }
            }
            Request.send();
        },

        /**
         * 批量删除留言
         * @param  {Array}   arrId
         * @param  {Function} callback
         */
        deleteItems: function(arrId, callback) {
            if (!arrId.length) {
                return;
            }
            var _this = this;
            var _arrUin = [];
            var comf = new parent.QZFL.widget.Confirm("提示", "删除操作不可恢复，您确定要继续么？", {
                type: 5,
                width: 330,
                height: 70,
                tips: ["确定", "取消"]
            });
            comf.onConfirm = function() {
                var _url = MSG.util.getUrl("delanswer");
                for (var i = 0; i < arrId.length; ++i) {
                    if (_this.getItemDataByCommentId(arrId[i])) {
                        _arrUin.push(_this.getItemDataByCommentId(arrId[i]).uin);
                    }
                }

                var data = {
                    hostUin: LOGIN_UIN,
                    idList: arrId.join(","),
                    uinList: _arrUin.join(","),
                    format: 'jsonp'
                };
                var Request = new QZBlog.Util.NetRequest({ url: _url, data: data, method: 'post', charset: 'utf-8', uniqueCGI: true });
                Request.onSuccess = function(responseData) {
                    QZONE.FP.showMsgbox(responseData.message || '删除成功', MSG.CONST.MSG_TYPE_SUCC, 1000);
                    setTimeout(function() {
                        if (!callback) {
                            _this.showPage();
                        } else {
                            callback(responseData);
                        }
                    }, 1000);
                };
                Request.send();
            }
            comf.show();
        },


        /**
         * 批量删除
         * 可以是删除精华或者是普通留言，分别删除
         */
        deleteBatch: function() {
            var checkedId = [],
                checkedEssenceId = [];
            var posts = 0;
            var _this = this;
            $e(".item_check_box").each(
                function() {
                    var aItem;
                    if (this.checked) {
                        aItem = _this.getItemDataByCommentId(this.getAttribute("commentId"));
                        if (aItem.effect & (1 << 30)) { //精华
                            checkedEssenceId.push(this.value);
                        } else {
                            checkedId.push(this.value);
                        }
                    }
                }
            );
            if (!checkedId.length && !checkedEssenceId.length) {
                QZONE.FP.showMsgbox("请先选择要删除的留言", MSG.CONST.MSG_TYPE_HINT, 2000);
            } else {
                if (checkedId.length && !checkedEssenceId.length) { //只是删除普通留言
                    this.deleteItems(checkedId);
                } else if (!checkedId.length && checkedEssenceId.length) { //只是取消精华
                    this.deleteEssenceItems(checkedEssenceId);
                } else { //普通留言和精华都有
                    this.deleteItems(checkedId, function(o) {
                        setTimeout(function() { //异步取消精华
                            _this.deleteEssenceItems(checkedEssenceId);
                        }, 100);
                    })
                }
            }
            QZONE.event.preventDefault();
        },

        /**
         * 删除单条评论
         * @param  {Number} id commentId
         */
        deleteSingle: function(id) {
            this.deleteItems([this.getItemDataByCommentId(id).id]);
        },

        /**
         * 删除指定评论
         * @param  {Array} arrId
         */
        deleteEssenceItems: function(arrId) {
            if (!arrId.length) {
                return;
            }
            var _this = this;
            var _data = {
                hostUin: LOGIN_UIN,
                idList: arrId.join(","),
                format: 'jsonp',
                type: 2
            }
            var Request = new QZBlog.Util.NetRequest({ url: MSG.util.getUrl("delessence"), data: _data, method: 'post', charset: 'utf-8', uniqueCGI: true });
            Request.onSuccess = function(responseData) {
                QZONE.FP.showMsgbox(responseData.message || '删除成功', MSG.CONST.MSG_TYPE_SUCC, 1000);
                setTimeout(function() {
                    _this.showPage();
                }, 1000)
            };
            Request.send();
        },

        /**
         * 删除单条置顶
         * @param  {Number} id
         */
        deleteEssenceSingle: function(id) {
            this.deleteEssenceItems([this.getItemDataByCommentId(id).id]);
        },

        /**
         * 批量置顶
         */
        addEssenceBatch: function() {
            var idArr = [];
            var cntCheck = 0;
            var posts = 0;
            var _this = this;
            $e(".item_check_box").each(function(checkbox) {
                var aItem;
                if (checkbox.checked) {
                    cntCheck++;
                    aItem = _this.getItemDataByCommentId(checkbox.getAttribute("commentId"));
                    if (!(aItem.effect & (1 << 30))) { //精华
                        idArr.push(checkbox.value);
                    }
                }
            });
            if (!idArr.length) {
                QZONE.FP.showMsgbox(cntCheck ? "已是置顶留言，请勿重复设置！" : "请选择想置顶的留言！", MSG.CONST.MSG_TYPE_HINT, 2000);
            } else {
                this.addEssenceItems(idArr.reverse());
            }
            QZONE.event.preventDefault();
        },

        /**
         * 批量置顶
         * @param {Array} arrId 评论id数组
         */
        addEssenceItems: function(arrId) {
            if (!arrId.length) {
                return;
            }

            var _this = this;
            var _data = {
                hostUin: LOGIN_UIN,
                idList: arrId.join(","),
                start: PAGE_SIZE * (CUR_PAGE_INDEX - 1),
                num: PAGE_SIZE,
                format: 'jsonp'
            }
            var Request = new QZBlog.Util.NetRequest({ url: MSG.util.getUrl("addessence"), data: _data, method: 'post', charset: 'utf-8', uniqueCGI: true });
            Request.onSuccess = function(responseData) {
                QZONE.FP.showMsgbox(responseData.message || '置顶成功', MSG.CONST.MSG_TYPE_SUCC, 2000);
                _this.showPage(1);
            };
            Request.send();
        },

        /**
         * 单条置顶
         * @param {Number} id
         */
        addEssenceSingle: function(id) {
            this.addEssenceItems([this.getItemDataByCommentId(id).id]);
        },

        /**
         * 评论用户加入黑名单
         * @param  {Number} uin
         */
        moveBlack: function(uin) {
            if (uin == LOGIN_UIN) {
                QZONE.FP.showMsgbox('您不能将自己加入黑名单中', MSG.CONST.MSG_TYPE_HINT, 2000);
                return;
            }
            QZONE.FP.getPortraitList([uin], function(rawData) {
                var nickname = rawData[uin][6];
                var confirmDlg = new parent.QZFL.widget.Confirm('提示', '您准备将' + nickname + '(' + uin + ')加入您的黑名单，加入后该用户可以访问您的空间，不能在您的空间留言、回复。', { type: 5, tips: ["确定", "取消"], width: 345, height: 110 });
                confirmDlg.onConfirm = function() {
                    var CGI_URL = "http://" + parent.g_W_Domain + "/cgi-bin/right/cgi_black_action_new",
                        data = { uin: LOGIN_UIN, action: 1, act_uin: uin },
                        fs = new QZFL.FormSender(CGI_URL, "post", data, "utf-8");
                    fs.onSuccess = function(re) {
                        if (re) {
                            msg = re.ret == 'succ' ? '该用户已加入您的黑名单' : re.msg;
                        } else {
                            msg = '系统正忙，请稍后操作';
                        }
                        QZONE.FP.showMsgbox(msg, MSG.CONST.MSG_TYPE_HINT, 2000);
                    };
                    fs.onError = function(re) {
                        var msg = (re && re.msg) ? re.msg : '系统正忙，请稍后操作';
                        QZONE.FP.showMsgbox(msg, MSG.CONST.MSG_TYPE_HINT, 2000);
                    };
                    fs.send("_Callback");
                };
                confirmDlg.show();
            }, { "needScore": 1, "needVIP": 1 });
        },

        /**
         * 举报
         * @param  {Number} id
         */
        reportComment: function(id) {
            var info = this.getItemDataByCommentId(id);
            QZONE.FP.showReportBox({
                "appname": "qzone",
                "subapp": "guestbook",
                "jubaotype": "article",
                "encoding": "utf-8",
                "uin": SPACE_UIN,
                "answerid": info.id,
                "replyuin": info.uin,
                "blogtype": ((IS_STAR || IS_BIZ || IS_CERTIFIED) ? 1 : 0)
            });
        },

        /**
         * 引用评论
         */
        quoteComment: function(id) {
            var _this = this;
            $e("#divPostPanel").show();
            MSG.util.scrollTo($("postCommentAnchor"), function() {
                var info = _this.getItemDataByCommentId(id);
                if (!info) {
                    return;
                }
                var quoteHtml = '引自：<cite>' + info["nickname"] + '</cite>&nbsp;&nbsp;于 <ins>' + info["pubtime"] +
                    '</ins> 发表的留言<br />引用内容：<br /><br /><q>' + procQuote(info['htmlContent']) + '</q>';

                MSG.comment.getContent(function(str) {
                    if (str.toLowerCase().indexOf('<blockquote') >= 0) {
                        str = str.replace(/(\<blockquote[^>]+>)(.*?)(<\/blockquote>)/gi, function() {
                            return arguments[1] + quoteHtml + arguments[3];
                        });
                    } else {
                        str = '<br /><blockquote style="overflow-x:hidden;font-size:12px;width:400px;border:dashed 1px gray;margin:10px;padding:10px">' + quoteHtml + '</blockquote><br />';
                    }
                    MSG.comment.setContent(str, { height: 150 });
                });
            });
        },

        selectAll: function() {
            var checked = QZFL.event.getTarget().checked;
            $e(".item_check_box").each(
                function() {
                    this.checked = !!checked;
                }
            )
            $("chkSelectAllBottom").checked = $("chkSelectAll").checked = !!checked;
        },

        toggleBathMode: function(blnBatch) {
            if (blnBatch == undefined) blnBatch = !_BATCH_MODE;
            $("btnBatch").title = $("btnBatch").innerHTML = blnBatch ? "退出批量管理" : "批量管理";
            $("btnBatchBottom").title = $("btnBatchBottom").innerHTML = blnBatch ? "退出批量管理" : "批量管理";
            $("divBatchOper").style.display = blnBatch ? "" : "none";
            $("divBatchOperBottom").style.display = blnBatch ? "" : "none";

            if (blnBatch) {
                QZFL.css.addClassName($("ulCommentList"), "list_batch_processing");
                QZFL.css.addClassName($("ulCommentList"), "list_batch_processing_noavatar");
            } else {
                QZFL.css.removeClassName($("ulCommentList"), "list_batch_processing");
                QZFL.css.removeClassName($("ulCommentList"), "list_batch_processing_noavatar");
            }
            if (IS_STAR || IS_BIZ || IS_CERTIFIED) {
                if (blnBatch) {
                    QZFL.css.removeClassName($("ulCommentList"), "list_without_avatar");
                } else {
                    QZFL.css.addClassName($("ulCommentList"), "list_without_avatar");
                }
            }
            /**
            $e(".avatar img").each(function(){
            	this.style.width = this.style.height = ((blnBatch || IS_LITE)?"50":"100") + "px";
            });
            **/
            $e(".op_basic").each(function() {
                if (blnBatch) {
                    QZFL.css.addClassName(this, "op_normal");
                } else {
                    QZFL.css.removeClassName(this, "op_normal");
                }
            });
            _BATCH_MODE = blnBatch;
        },

        updatePageView: function() {
            var ableBatch = _PAGE_DATA.total && IS_OWNER;
            if (ableBatch) {
                this.toggleBathMode(_BATCH_MODE);
                $("chkSelectAll").checked = false;
            } else {
                this.toggleBathMode(false);
            }
            QZFL.css[ableBatch ? 'removeClassName' : 'addClassName']($('btnBatch'), 'none');
            QZFL.css[ableBatch ? 'removeClassName' : 'addClassName']($("btnBatchBottom"), "none");
            $('cnt').innerHTML = _PAGE_DATA.total;
        },

        /**
         * 设置quickwrite初始数据
         * @param {Object} data
         */
        setInitData: function(data) {
            _PAGE_DATA = data;
        },

        /**
         * 处理quickwrite页面剩余逻辑
         */
        processInitPage: function() {
            this.setInitData(INIT_DATA);
            procCommentArea();
            this.showUserExtractInfo(INIT_DATA.items);
            this.bindMenuEvent();
            for (var i = 0; i < INIT_DATA.items.length; i++) {
                _showCommentItemReply(INIT_DATA.items[i]);
            }
            this.showPagination(CUR_PAGE_INDEX, INIT_DATA.total);
            this.updatePageView();
            setTimeout(function() {
                MSG.Signature.toggleSignature();
            }, 0);
        },

        init: function() {
            this.processInitPage();
            this.bindFuncLinkEvent();
        }
    };

    /**
     * 编辑留言编辑器
     */
    var EditCommentEditor = (function() {
        var editor_obj_coll = {};
        var building_coll = false;
        var placeholder_text = '既然来了，就顺便留句话儿吧……';

        return {
            load: function(commentId, callback) {
                var _this = this;
                callback = callback || QZFL.emptyFn;
                var editor_obj = editor_obj_coll[commentId];
                if (editor_obj && !building_coll[commentId]) {
                    callback(editor_obj);
                    return;
                }

                QZONE.FP.showMsgbox("正在初始化编辑器，请稍候...", MSG.CONST.MSG_TYPE_LOADING);
                QZFL.imports('/qzone/veditor/release/ve.qzonemsgboard.js', function() {
                    if (building_coll[commentId]) {
                        editor_obj.onInitComplete.add(function(obj) {
                            QZONE.FP.hideMsgbox();
                            callback(obj);
                        });
                    } else {
                        building_coll[commentId] = true;
                        editor_obj = VEditor.create({
                            container: $('singleCommentEditorAnchor_' + commentId),
                            width: 'auto',
                            adapter: 'qzfl',
                            height: 97,
                            domain: 'qq.com',
                            plugins: 'font,glowfont,color,textjustify,history,linetag,toolbarswitcher,xpaste,sosoemotion,qzonemention',
                            buttons: 'fontname,fontsize|bold,italic,underline|color,glowfont|justifyleft,justifycenter,justifyright,justifyfull,emotion|undo,redo'
                        });
                        editor_obj.onClick.add(function() {
                            if (QZFL.string.trim(this.getTextContent()) == placeholder_text) {
                                _this.setContent('');
                            }
                        });
                        editor_obj.addShortcut('ctrl+enter', function() {
                            MSG_LIST._doModifyComment(_CUR_EDIT_COMMENT_IDX);
                        });
                        editor_obj.onInitComplete.add(function(obj) {
                            QZONE.FP.hideMsgbox();
                            building_coll[commentId] = false;
                            callback();
                            editor_obj.getBody().style.overflowX = 'hidden';
                        });
                        editor_obj_coll[commentId] = editor_obj;
                    }
                });
            },

            showEditor: function(commentId, callback) {
                $('singleCommentEditorDiv_' + commentId).style.display = '';
                this.load(commentId, callback);
            },

            hideEditor: function(commentId, destroyInstance) {
                $('singleCommentEditorDiv_' + commentId).style.display = 'none';
                if (destroyInstance) {
                    building_coll[commentId] = false;
                }
            },

            resetInstanceCollection: function() {
                _CUR_EDIT_COMMENT_IDX = null;
                editor_obj_coll = {};
            },

            getBody: function(commentId) {
                return editor_obj_coll[commentId].getBody();
            },

            setDefaultText: function(commentId) {
                var s = placeholder_text ? '<span style="font-size:12px; color:gray;">' + placeholder_text + '</span>' : '';
                editor_obj_coll[commentId].setContent({ content: s, addHistory: false });
            },

            setContent: function(commentId, str) {
                editor_obj_coll[commentId].setContent({ content: str });
            },

            insertContent: function(commentId, str) {
                var txt = QZFL.string.trim(editor_obj_coll[commentId].getTextContent());
                if (txt == placeholder_text) {
                    editor_obj_coll[commentId].clearContent();
                }
                editor_obj_coll[commentId].insertHtml({ content: str });
            },

            getContent: function(commentId) {
                if (!editor_obj_coll[commentId]) {
                    return undefined;
                }
                var txt = QZFL.string.trim(editor_obj_coll[commentId].getTextContent());
                if (txt == placeholder_text) {
                    return '';
                }
                return editor_obj_coll[commentId].getContent();
            },

            getUbbContent: function(commentId) {
                return html2Ubb(this.getContent(commentId));
            },

            clearContent: function(commentId) {
                return editor_obj_coll[commentId].clearContent();
            },

            focus: function(commentId) {
                return editor_obj_coll[commentId].focus();
            }
        }
    })();

    /**
     * 整理评论区域内容
     * 包括图片大小调整
     * @param {Object} data
     */
    var procCommentArea = function() {
        var imgs = [];
        var tmp = $('authorInfo').getElementsByTagName('IMG');
        if (tmp.length) {
            imgs = imgs.concat(QZFL.dom.collection2Array(tmp));
        }
        imgs = imgs.concat($e('#ulCommentList div.cont img').elements || []);
        QZFL.each(imgs, function(img) {
            picsize(img, 500, 1000, function(changed) {
                img.title = img.alt = changed ? '点击预览原图' : '';
                if (changed) { img.onclick = function() { window.open(this.src); } }
            });
            if (img.getAttribute('transImg') && QZFL.userAgent.ie < 7 && img.style.filter) {
                img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=" + img.src + ", sizingmethod=scale);";
                img.src = '/ac/b.gif';
            }
        });
    };

    /**
     * 引用归纳
     */
    var procQuote = function(str) {
        str = str.replace(/\n\x20(^\x20)*/ig, "\n&nbsp;$1").replace(/\x20\x20/g, "&nbsp;&nbsp;").replace(/\n/g, "<br />");
        str = str.replace(/\[quote\=引自：(.+?)(?:\x20|&nbsp;){1,2}于\x20(.+?)\x20发表的评论\]/g, "\x03引自：<cite>$1</cite>&nbsp;&nbsp;于 <ins>$2</ins> 发表的评论<br />\x02").replace(/\[\/quote\]/g, "\x01");
        for (var i = 0; i < 2; i++) { // 支持2层引用
            str = str.replace(/\x03([^\x03\x01\x02]*?)\x02([^\x03\x01\x02]*?)\x01/g, function(a, b, c) {
                return (!QZONE.userAgent.ie ? '<br />' : '') + '<blockquote style="overflow-x:hidden;font-size:12px;width:400px;border:dashed 1px gray;margin:10px;padding:10px">' + b + '引用内容：<br /><br /><q>' + c + '</q></blockquote>' + (!QZONE.userAgent.ie ? '<br />' : '');
            });
        }
        str = str.replace(/[\x03\x02\x01]/g, "");
        return parseMentionFormat(str);
    };

    /**
     * 获取用户等级
     * @param  {Number} score 积分
     * @return {Number}
     */
    var getUserGrade = function(score) {
        var t = [0, 5, 10, 15, 20, 30, 40, 50, 60, 75, 90];

        if (score < 90) {
            for (var i = t.length - 2; i >= 0; --i) {
                if (score - t[i] >= 0) {
                    return i;
                }
            }
        } else {
            return Math.floor(Math.sqrt(score / 10)) + 7;
        }
    };

    /**
     * 是否为装转用户
     * @param  {String} userBitmap
     * @return {Boolean}
     */
    var isVipUser = function(userBitmap) {
        return getOneBitmap(userBitmap, 27);
    };

    /**
     * 年费是否过期
     * @param  {String} userBitmap
     * @return {Boolean}
     */
    var isUserVIPExpress = function(userBitmap) {
        return getOneBitmap(userBitmap, 17);
    };

    /**
     * 是否为过期年费用户
     * @param  {String} userBitmap
     * @return {Boolean}
     */
    var isYearVipExpire = function(userBitmap) {
        //曾经开通过年费但是现在不是年费
        return hadOpenYearVip(userBitmap) && !isUserVIPExpress(userBitmap);
    };

    /**
     * 是否曾经开通过年费黄钻
     * @param  {string} userBitmap
     * @return {number} 1表示开过，0表示没开过
     */
    var hadOpenYearVip = function(userBitmap) {
        return getOneBitmap(userBitmap, 39);
    };

    /**
     * 黄钻用户等级
     * @param  {String} userBitmap
     * @return {Number}
     */
    var getUserVIPLevel = function(userBitmap) {
        return getBitmap(userBitmap, 18, 4);
    };

    /**
     * @ignore
     * 从bitmap中取一位
     */
    var getOneBitmap = function(sBitmap, bit) {
        return parseInt(sBitmap.charAt(15 - Math.floor((bit - 1) / 4)), 16) >> ((bit - 1) % 4) & 1;
    };

    /**
     * @ignore
     * 支持数字，hash参数
     */
    var getBitmap = function(sBitmap, bit, length) {
        var type = typeof(bit),
            k, rslt = {},
            _l;
        if (type == 'object') {
            for (k in bit) {
                rslt[k] = getOneBitmap(sBitmap, bit[k]);
            }
            return rslt;
        }
        if (type == 'number') {
            length = length || 1;
            rslt = '';
            for (k = bit, _l = bit + length; k < _l; k++) {
                rslt = getOneBitmap(sBitmap, k) + rslt;
            }
            return parseInt(rslt, 2);
        }
        return null;
    };
    if (!window.isAjaxMode) {
        MSG_LIST.init();
    }
    MSG.list = MSG_LIST;
})(MSG);
(function(MSG) {
    var _AUTHOR_TXT = '';
    var DEF_OWNER_TXT = '<p><a href="javascript:;" rel="showAuthorInfoEditor" title="说些寄语，欢迎您的空间访客吧" class="c_tx">说些寄语，欢迎您的空间访客吧</a></p>';
    var DEF_GUEST_TXT = '欢迎光临我的空间';

    /**
     * 主人寄语模块
     */
    var AuthorInfo = {
        setContent: function(str) {
            _AUTHOR_TXT = str;
        },

        getContent: function() {
            return _AUTHOR_TXT;
        },

        /**
         * 显示主人寄语
         */
        present: function() {
            var msg = this.getContent();
            $('divAuthorMsgOper').style.display = (IS_OWNER && msg) ? '' : 'none';
        },

        /**
         * 显示编辑器
         */
        showEditor: function() {
            $("divAuthorMsgOper").style.display = "none";
            $("authorInfo").style.display = "none";
            $("editAuthorMsgDiv").style.display = "";
            var msg = this.getContent();
            AuthorEditor.load(function() {
                AuthorEditor.setContent(msg);
            });
        },

        /**
         * 隐藏编辑器
         * @return {[type]} [description]
         */
        hideEditor: function() {
            $("divAuthorMsgOper").style.display = IS_OWNER && this.getContent() ? "" : "none";
            $("authorInfo").style.display = "";
            $("editAuthorMsgDiv").style.display = "none";
        },

        /**
         * 更新主人寄语
         */
        updateAuthorMsg: function() {
            var content = QZFL.string.trim(AuthorEditor.getUbbContent());
            if (QZFL.string.getRealLen(content) > MSG.CONST.MAX_AUTHORMSG_LENGTH) {
                QZONE.FP.showMsgbox("您编辑的内容长度不能超过 " + MSG.CONST.MAX_AUTHORMSG_LENGTH + " 个字，请进行适当的删减再进行发表", MSG.CONST.MSG_TYPE_HINT, 3000);
                return;
            }
            var data = {
                hostUin: QZBlog.Logic.SpaceHostInfo.getUin(),
                content: content,
                format: 'jsonp'
            };
            var Request = new QZBlog.Util.NetRequest({ url: MSG.util.getUrl("modifyinfo"), data: data, method: 'post', charset: 'utf-8', uniqueCGI: true });
            Request.onSuccess = function(data) {
                QZONE.FP.showMsgbox(data.message || '修改成功', MSG.CONST.MSG_TYPE_SUCC, 2000);
                location.reload(true);
            }
            Request.send();
        },

        init: function() {
            var _this = this;
            QZFL.event.addEvent($('btnEditAuthorMsg'), 'click', function() {
                _this.showEditor();
            });

            QZFL.event.addEvent($('btnPostAuthorMsg'), 'click', function() {
                _this.updateAuthorMsg();
            });

            QZFL.event.addEvent($('btnCancelAuthorMsg'), 'click', function() {
                _this.hideEditor();
            });

            QZFL.event.addEvent(document.body, 'click', function(ev) {
                var tag = QZFL.event.getTarget(ev);
                if (tag && tag.getAttribute('rel') == 'showAuthorInfoEditor') {
                    _this.showEditor();
                    QZFL.event.preventDefault();
                }
            })

            //展示主人寄语
            this.setContent(INIT_DATA.authorInfo.htmlMsg || INIT_DATA.authorInfo.msg);
            this.present();
        }
    };


    /**
     * 主人寄语编辑器
     */
    var AuthorEditor = (function() {
        var editor_obj;
        var editor_obj_building = false;
        var placeholder_text = '';

        if (!window.g_V) {
            window.g_V = parent.g_V;
        }

        return {
            load: function(callback) {
                var _this = this;
                callback = callback || QZFL.emptyFn;
                if (editor_obj && !editor_obj_building) {
                    callback(editor_obj);
                    return;
                }

                QZONE.FP.showMsgbox("正在初始化编辑器，请稍候...", MSG.CONST.MSG_TYPE_LOADING);
                QZFL.imports('/qzone/veditor/release/ve.qzonemsgboard.js', function() {
                    if (editor_obj_building) {
                        editor_obj.onInitComplete.add(function(obj) {
                            QZONE.FP.hideMsgbox();
                            callback(obj);
                        });
                    } else {
                        editor_obj_building = true;
                        editor_obj = VEditor.create({
                            container: 'authorMsgEditorAnchor',
                            adapter: 'qzfl',
                            width: 'auto',
                            height: 200,
                            domain: parent.g_domain || 'qq.com',
                            plugins: 'font,glowfont,color,textjustify,history,toolbarswitcher,linetag,xpaste,emotion,qzonemedia,qzoneimage,imagetools',
                            buttons: 'fontname,fontsize|bold,italic,underline|color,glowfont|justifyleft,justifycenter,justifyright,justifyfull,emotion,image|undo,redo'
                        });
                        editor_obj.onClick.add(function() {
                            if (placeholder_text && QZFL.string.trim(this.getTextContent()) == placeholder_text) {
                                _this.setContent('');
                            }
                        });
                        editor_obj.addShortcut('ctrl+enter', function() {
                            AuthorInfo.updateAuthorMsg();
                        });
                        editor_obj.onInitComplete.add(function(obj) {
                            QZONE.FP.hideMsgbox();
                            editor_obj_building = false;
                            callback(obj);
                        });
                    }
                });
            },

            setContent: function(str) {
                editor_obj.setContent({ content: str });
            },

            getContent: function() {
                var txt = QZFL.string.trim(editor_obj.getTextContent());
                if (placeholder_text && txt == placeholder_text) {
                    return '';
                }
                return editor_obj.getContent();
            },

            getUbbContent: function() {
                return html2Ubb(this.getContent());
            }
        }
    })();
    if (!window.isAjaxMode) {
        AuthorInfo.init();
    }

    MSG.authorInfo = AuthorInfo;
})(MSG);
(function(MSG) {
    var EDITOR_PLACEHOLDER = ''; // '既然来了，就顺便留句话儿吧……';
    var getFormatTime = function() {
        var _time = new Date();

        var _m = _time.getMinutes().toString();
        var _s = _time.getSeconds().toString();
        var _h = _time.getHours().toString();
        _m = _m.length < 2 ? "0" + _m : _m;
        _s = _s.length < 2 ? "0" + _s : _s;
        _h = _h.length < 2 ? "0" + _h : _h;

        var _mm = (_time.getMonth() + 1).toString();
        var _dd = _time.getDate().toString();
        _mm = _mm.length < 2 ? "0" + _mm : _mm;
        _dd = _dd.length < 2 ? "0" + _dd : _dd;

        return ([_time.getFullYear(), "-", _mm, "-", _dd, " "]).join("") + ([_h, ":", _m, ":", _s]).join("");
    }

    /**
     * 文本内容检测
     * @param  {String} content
     * @return {Number}
     */
    var checkCommentContent = function(content) {
        //空内容检查
        if (content.length == 0) {
            alert("请输入留言内容");
            return -1;
        }

        //输入内容长度检查
        if (QZFL.string.getRealLen(content) > MSG.CONST.MAX_COMMENT_LENGTH) {
            QZONE.FP.showMsgbox("您编辑的内容长度不能超过 " + (MSG.CONST.MAX_COMMENT_LENGTH / 2) + " 个字，请进行适当的删减再进行发表", MSG.CONST.MSG_TYPE_HINT, 2000);
            return -1;
        }

        var prop = new MSG.util.ContentProperty(content);
        //贴图数目检查
        if (prop["image"] > 3 || prop["imagesize"] > 3) {
            alert("对不起，您只能插入3张图片或搜索表情");
            return -1;
        }
        if (prop["qqshow"] > 1) {
            alert("对不起，您只能插入一张QQ秀泡泡");
            return -1;
        }
        delete prop;

        var re = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\]([^\[]{31,})\[\/ft\]/;
        if (re.test(content)) {
            if (!confirm("您设置发光的文字已超过30个，发光字效果将可能失效，确认发表此留言吗？")) {
                return -1;
            }
        }

        re = /\[ffg,([a-zA-z#0-9]{1,10}),[a-zA-z&#=;0-9]{1,10}\]/g;
        if (content.match(re) && content.match(re).length > 1) {
            if (!confirm("发光字回复中效果只能使用一次，更多的发光字将无法显示，确认发表此留言吗？")) {
                return -1;
            }
        }

        re = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\](.*\[f.*)\[\/ft\]/;
        if (re.test(content)) {
            if (!confirm("若发光字中使用了其它特效，发光字效果将可能失效，确认发表此留言吗？")) {
                return -1;
            }
        }
        return 0;
    };

    var isScalar = function(param) {
        return param !== null && param !== undefined && typeof(param) != 'object' && typeof(param) != 'function';
    };

    /**
     * 留言模块
     */
    var MsgComment = {
        extraParams: {},
        onBeforeSubmitHooks: [],
        onSuccessCommentHooks: [],
        onLoadHooks: [],
        _editor: null,
        _editorLoaded: false,

        /**
         * 提交留言
         */
        submitComment: function() {
            var _this = this;
            var content = QZFL.string.rtrim(AddCommentEditor.getUbbContent());
            if (!content || content.length == 0) {
                alert("您还没有填写留言内容");
                AddCommentEditor.focus();
                return;
            }

            switch (checkCommentContent(content)) {
                case 0:
                    break;
                case -1:
                    AddCommentEditor.focus();
                    return;
                default:
                    return;
            }


            var chkFlag;
            QZFL.each(this.onBeforeSubmitHooks, function(hk) {
                if (chkFlag !== false) {
                    chkFlag = hk(content);
                } else {
                    return false;
                }
            });
            if (chkFlag === false) {
                return;
            }

            var url = MSG.util.getUrl("addanswer");
            var data = function() {
                var d = {
                    content: content,
                    hostUin: SPACE_UIN,
                    uin: LOGIN_UIN,
                    format: 'jsonp',
                    inCharset: 'utf-8',
                    outCharset: 'utf-8'
                }
                if ($("checkSignInput").checked) {
                    d.hassign = "yes";
                }

                for (var i in _this.extraParams) {
                    if (isScalar(_this.extraParams[i])) {
                        d[i] = _this.extraParams[i];
                    }
                }
                return d;
            };

            var Request = new QZBlog.Util.NetRequest({ url: url, data: data, method: 'post', charset: 'utf-8', uniqueCGI: true });
            Request.onSuccess = function(responseData) {
                _this.extraParams = {};
                QZFL.each(_this.onSuccessCommentHooks, function(hk) {
                    hk(content);
                });

                AddCommentEditor.setDefaultText();
                var succNode = responseData.data;
                QZONE.FP.showMsgbox(responseData.message || '发表成功', MSG.CONST.MSG_TYPE_SUCC, 2000);
                var succNum = succNode.msgtype; //1:待审核留言 0:普通
                if (succNum == 1 || isNaN(succNum)) {
                    if (MSG.global.auditOn && !IS_OWNER) {
                        MSG.global.auditNum++;
                        try {
                            $("auditNum").innerHTML = MSG.global.auditNum;
                        } catch (ex) {}
                    }
                } else {
                    setTimeout(function() {
                        MSG.list.showPage(1);
                    }, 1000);
                }
            };
            Request.send();
        },

        init: function() {
            var _this = this;

            QZFL.event.addEvent($('btnPostMsg'), 'click', function() {
                _this.submitComment();
            });

            QZFL.event.addEvent($('btnWantPost'), 'click', function() {
                _this.showEditor();
            });

            QZFL.event.addEvent($('cancelEditorHref'), 'click', function() {
                _this.hideEditor();
            });

            $('maskEditor').value = EDITOR_PLACEHOLDER || '';

            QZFL.event.addEvent($('maskEditor'), 'click', function() {
                _this.showEditor();
                if (EDITOR_PLACEHOLDER && this.value == EDITOR_PLACEHOLDER) {
                    this.value = '';
                }
            });

            QZFL.event.addEvent($('maskEditor'), 'blur', function() {
                if (EDITOR_PLACEHOLDER && this.value == '') {
                    this.value = EDITOR_PLACEHOLDER;
                }
            });

            //客人态默认显示编辑器
            if (!IS_OWNER) {
                QZFL.css.removeClassName($('maskEditor'), 'none');
                setTimeout(function() {
                    try { $('maskEditor').focus(); } catch (ex) {};
                }, 10);
                QZFL.css.addClassName($('commentEditorAnchor'), 'none');
                setTimeout(function() {
                    _this.showEditor();
                }, 1000);
            } else {
                this.hideEditor();
            }
        },

        onLoad: function(cb) {
            if (this._editorLoaded) {
                cb(this.editor);
            } else {
                this.onLoadHooks.push(cb);
            }
        },

        showEditor: function(callback, opt) {
            callback = callback || QZFL.emptyFn;
            var _this = this;
            $('divPostPanel').style.display = '';
            //$('cancelEditorHref').style.display = IS_OWNER ? '' : 'none';
            AddCommentEditor.load(function(editor) {
                callback(editor);
                _this._editor = editor;
                _this._editorLoaded = true;
                QZFL.each(_this.onLoadHooks, function(fn) {
                    fn(editor);
                });
            }, opt);
        },

        hideEditor: function() {
            $('divPostPanel').style.display = 'none';
            $('cancelEditorHref').style.display = 'none';
            AddCommentEditor.clearContent();
        },

        insertContent: function(str) {
            this.showEditor(function() {
                AddCommentEditor.insertContent(str);
            })
        },

        getContent: function(callback) {
            this.showEditor(function() {
                callback(AddCommentEditor.getContent());
            })
        },

        getUbbContent: function(callback) {
            this.showEditor(function() {
                callback(AddCommentEditor.getUbbContent());
            })
        },

        setContent: function(str, opt) {
            this.showEditor(function() {
                AddCommentEditor.setContent(str);
            }, opt);
        }
    };

    /**
     * 发表评论编辑器
     */
    var AddCommentEditor = (function() {
        var editor_obj;
        var editor_obj_building = false;

        return {
            load: function(callback, opt) {
                MSG.util.scrollTo($('divPostPanel'));

                var _this = this;
                callback = callback || QZFL.emptyFn;
                if (editor_obj && !editor_obj_building) {
                    var h = (opt ? (opt.height || 91) : 91);
                    editor_obj.focus();
                    editor_obj.setHeight(h);
                    callback(editor_obj);
                    return;
                }

                QZFL.css.removeClassName($('maskEditor'), 'none');
                $('maskEditor').focus();
                $('maskEditor').title = '正在加载编辑器...';
                QZFL.css.addClassName($('commentEditorAnchor'), 'none');

                QZFL.imports('/qzone/veditor/release/ve.qzonemsgboard.js', function() {
                    if (editor_obj_building) {
                        editor_obj.onInitComplete.add(function(obj) {
                            callback(obj);
                        });
                    } else {
                        //名博、认证空间、商博 简化留言工具条
                        var plugins = (IS_STAR || IS_BIZ || IS_CERTIFIED) ? 'emotion,history,linetag,xpaste,qzonemention' :
                            'font,glowfont,color,textjustify,history,linetag,toolbarswitcher,xpaste,emotion,qzonemention';
                        var buttons = (IS_STAR || IS_BIZ || IS_CERTIFIED) ? 'emotion' :
                            'fontname,fontsize|bold,italic,underline|color,glowfont|justifyleft,justifycenter,justifyright,justifyfull|emotion|undo,redo|toolbarswitcher';

                        editor_obj_building = true;
                        editor_obj = VEditor.create({
                            container: 'commentEditorAnchor',
                            advToolbarClass: 'msg_less_tools',
                            advToolbarText: '高级模式',
                            normalToolbarText: '普通模式',
                            toolbarMode: 'advance',
                            adapter: 'qzfl',
                            width: 'auto',
                            domain: 'qq.com',
                            height: (opt ? (opt.height || 91) : 91),
                            plugins: plugins,
                            buttons: buttons
                        });
                        editor_obj.onClick.add(function() {
                            if (EDITOR_PLACEHOLDER && QZFL.string.trim(this.getTextContent()) == EDITOR_PLACEHOLDER) {
                                _this.setContent('');
                            }
                        });
                        editor_obj.onKeyUp.addLast(function() {
                            if (EDITOR_PLACEHOLDER && QZFL.string.trim(this.getTextContent()) == EDITOR_PLACEHOLDER) {
                                _this.setContent('');
                            }
                        });
                        editor_obj.addShortcut('ctrl+enter', function() {
                            MsgComment.submitComment();
                        });
                        editor_obj.onInitComplete.add(function(obj) {
                            if (EDITOR_PLACEHOLDER && $('maskEditor').value == EDITOR_PLACEHOLDER) {
                                _this.setDefaultText();
                            } else {
                                _this.setContent($('maskEditor').value);
                            }
                            QZFL.css.addClassName($('maskEditor'), 'none');
                            QZFL.css.removeClassName($('commentEditorAnchor'), 'none');

                            editor_obj.focus();
                            editor_obj_building = false;
                            callback(obj);
                        });
                    }
                });
            },

            setDefaultText: function() {
                var s = EDITOR_PLACEHOLDER ? '<span style="font-size:12px; color:gray;">' + EDITOR_PLACEHOLDER + '</span>' : '';
                editor_obj.setContent({ content: s, addHistory: false });
            },

            setContent: function(str) {
                editor_obj.setContent({ content: str });
            },

            insertContent: function(str) {
                var txt = QZFL.string.trim(editor_obj.getTextContent());
                if (EDITOR_PLACEHOLDER && txt == EDITOR_PLACEHOLDER) {
                    editor_obj.clearContent();
                }
                editor_obj.insertHtml({ content: str });
            },

            getContent: function() {
                var txt = QZFL.string.trim(editor_obj.getTextContent());
                if (EDITOR_PLACEHOLDER && txt == EDITOR_PLACEHOLDER) {
                    return '';
                }
                return editor_obj.getContent();
            },

            getUbbContent: function() {
                return html2Ubb(this.getContent());
            },

            clearContent: function() {
                return editor_obj && editor_obj.clearContent();
            },

            focus: function() {
                return editor_obj.focus();
            }
        }
    })();

    MsgComment.init();
    MSG.comment = MsgComment;
})(MSG);
(function(MSG) {
    var CGI_DM = 'http://sns.qzone.qq.com';
    var CGI_COLL = {
        'words': CGI_DM + '/cgi-bin/effect/effect_cgi_getwords',
        'del': CGI_DM + '/cgi-bin/effect/effect_cgi_del',
        'get': CGI_DM + '/cgi-bin/effect/effect_cgi_get',
        'set': CGI_DM + '/cgi-bin/effect/effect_cgi_set',
        'friendlist': CGI_DM + '/cgi-bin/effect/effect_cgi_getfriendlist'
    };

    var FriendImpress = {
        serverId: 0,
        isFriend: parent.g_isFriend, //是否为好友，这里不区分单向、双向

        init: function() {
            var _this = this;

            this.showImpressList(function() {
                _this.showDefWords();
            });

            if (!IS_OWNER) {
                if (this.isFriend) {
                    QZFL.css.removeClassName($('impressAction'), 'none');

                    QZFL.event.addEvent($('impressActionTriggerBtn'), 'click', function() {
                        QZFL.css.removeClassName($('impressActionForm'), 'none');
                        $('impressActionInput').focus();
                    });

                    QZFL.event.addEvent(document.body, 'click', function(ev) {
                        var tag = QZFL.event.getTarget(ev);
                        if (tag != $('impressActionTriggerBtn') && tag != $('impressActionForm') &&
                            !QZFL.dom.contains($('impressActionTriggerBtn'), tag) && !QZFL.dom.contains($('impressActionForm'), tag)) {
                            QZFL.css.addClassName($('impressActionForm'), 'none');
                        }
                    });

                    QZFL.event.addEvent($('impressActionInput'), 'keydown', function(e) {
                        if (e.keyCode == 13) {
                            _this.setImpress($('impressActionInput').value);
                        }
                    });
                    QZFL.event.addEvent($('impressActionBtn'), 'click', function() {
                        _this.setImpress($('impressActionInput').value);
                    });
                } else {
                    QZFL.css.addClassName($('impressAction'), 'none');
                }
            }

            QZFL.event.addEvent($('friendImpress'), 'click', function(ev) {
                var tag = QZFL.event.getTarget(ev);
                var rel = tag.getAttribute('rel');
                if (rel) {
                    if (tag.tagName == 'A') {
                        QZFL.event.preventDefault(ev);
                    }

                    switch (rel) {
                        case 'delImpress':
                            _this.delImpress(tag.getAttribute('data'));
                            break;

                        case 'quickSetImpress':
                            _this.setImpress(tag.getAttribute('data'));
                            break;

                        case 'impressAddFriend':
                            _this.addFriend(function(msg) {
                                QZONE.FP.showMsgbox(msg, MSG.CONST.MSG_TYPE_SUCC, 2000);
                                setTimeout(function() { location.reload(); }, 2000)
                            });
                            break;
                        case 'impressLogin':
                            _this.showLogin();
                            break;

                    }
                }
            });
        },

        showLogin: function() {
            QZONE.FP.showLoginBox('msgboardFriendImpress', function() {
                QZONE.FP._t.location.reload(); //为了兼容 parent.g_isFriend刷新
            });
        },

        /**
         * 添加好友
         * @deprecated 添加好友当前没有办法是否成功
         * 所以callback一般只能通过刷新页面来重置
         * @param {Function} callback
         */
        addFriend: function(callback) {
            callback = callback || QZFL.emptyFn;
            QZONE.FP.addFriend(SPACE_UIN, 0, false, {
                callback: function(re) {
                    callback(re.message);
                }
            });
        },

        /**
         * 显示推荐描述
         * @description 主人态可用
         */
        showDefWords: function() {
            if (!LOGIN_UIN || IS_OWNER) {
                return;
            }
            this.getWords({}, function(responseData) {
                if (responseData && responseData.length) {
                    var html = '';
                    QZFL.each(responseData, function(item) {
                        html += '<a href="javascript:;" class="bg5" rel="quickSetImpress" data="' + QZFL.string.escHTML(item.content) + '">' + item.content + '</a>';
                    });
                    $('defaultImpressWords').innerHTML = html;
                    QZFL.css.removeClassName($('defaultImpressWords').parentNode, 'none');
                } else {
                    QZFL.css.addClassName($('defaultImpressWords').parentNode, 'none');
                }
            });
        },

        /**
         * 显示描述列表
         * @param  {Function} succCb
         */
        showImpressList: function(succCb) {
            this.getImpress({}, function(data) {
                var html = '';
                if (data.length) {
                    for (var i = 0, j = data.length; i < j; i++) {
                        var item = data[i];
                        var title = QZFL.string.escHTML(QZFL.string.restHTML(item.content));

                        //客人态没有该项列表
                        if (item.uinlist) {
                            var tmp = [];
                            QZFL.each(item.uinlist, function(user) {
                                tmp.push(QZFL.string.escHTML(QZFL.string.restHTML(user.nick)));
                            });
                            title = tmp.join('、\r\n') + ' 这样描述我：' + QZFL.string.escHTML(QZFL.string.restHTML(item.content));
                        }

                        html += '<span class="item"><a href="javascript:;" class="bor2 bg2 txt" title="' + title + '">' +
                            '<span class="ellipsis">' + item.content + '</span>' +
                            (item.uinnum > 1 ? '<em class="c_tx2">(' + item.uinnum + ')</em>' : '') + '</a>';
                        if (IS_OWNER) {
                            html += '<a href="javascript:;" class="del none" rel="delImpress" data="' + QZFL.string.escHTML(item.content) + '" title="删除该项描述">&#10005;</a>';
                        }
                        html += '</span>';
                    }
                } else {
                    html = '<span class="tips">暂时没有好友印象</span>';
                }
                $('impressList').innerHTML = html;

                $e('#impressList span.item').onMouseOver(function() {
                    $e('a.del', this).removeClass('none');
                });
                $e('#impressList span.item').onMouseOut(function() {
                    $e('a.del', this).addClass('none');
                });
                succCb && succCb();
            }, function(msg, code) {
                if (code != 200) {
                    QZFL.css.addClassName($('impressAction'), 'none');
                } else {
                    msg = '主人暂时没有收到好友描述';
                }

                if (code == 501) {
                    msg = '你们还不是好友，无法查看别人对他的描述。<a href="javascript:;" rel="impressAddFriend">立即加为好友</a>';
                } else if (code == -3) {
                    msg = '您必须登录之后才能看到好友印象，请先<a href="javascript:;" rel="impressLogin">登录</a>'
                }
                $('impressList').innerHTML = '<span class="tips">' + msg + '</span>';
            });
        },

        /**
         * 获取印象列表
         * @param  {Object}   opt
         * @param  {Function} succCb
         * @param  {Function} errCb
         */
        getImpress: function(opt, succCb, errCb) {
            succCb = succCb || QZFL.emptyFn;
            errCb = errCb || QZFL.emptyFn;
            var data = QZFL.object.extend({
                uin: LOGIN_UIN,
                getuin: SPACE_UIN,
                random: Math.random()
            }, opt);
            var jg = new QZFL.JSONGetter(CGI_COLL.get, null, data, 'UTF-8');
            jg.onSuccess = function(responseData) {
                if (responseData.result && responseData.result.code == 0) {
                    succCb(responseData.effect.EffectCnt);
                } else {
                    errCb(responseData.result.msg, responseData.result.code);
                }
            };
            jg.onError = function(msg) {
                errCb(msg);
            };
            jg.send('_Callback');
        },

        /**
         * 获取热词
         * @param  {Object}   opt      选项
         * @param  {Function} succCb
         */
        getWords: function(opt, succCb, errCb) {
            succCb = succCb || QZFL.emptyFn;
            errCb = errCb || QZFL.emptyFn;
            var data = QZFL.object.extend({
                uin: SPACE_UIN,
                sex: parent.QZONE.FrontPage._getSummary(1) || -1, //1男2女
                effectnum: 15
            }, opt);

            var jq = new QZFL.JSONGetter(CGI_COLL.words, null, data, "utf-8");
            jq.onSuccess = function(responseData) {
                if (responseData.result && responseData.result.code == 0) {
                    succCb(responseData.effect.EffectCnt);
                } else {
                    errCb(responseData.result.msg);
                }
            };
            jq.onError = function(msg) {
                QZONE.FP.showMsgbox('对不起，由于网络异常', MSG.CONST.MSG_TYPE_ERROR, 2000);
                errCb(msg);
            };
            jq.send('_Callback');
        },

        /**
         * 设置印象词
         * @param {String} str
         * @param {Function} succCb
         * @param {Function} errCb
         */
        setImpress: function(str, succCb, errCb) {
            var today = new Date().getDate();
            var k = 'QZONE_MSGBOARD_FRIEND_IMPRESS_LIMIT_' + LOGIN_UIN + '_' + SPACE_UIN + '_' + (new Date().getDate());
            if (parent[k]) {
                QZONE.FP.showMsgbox('今天您已经对他添加了印象，明天才能添加新的印象哦！', MSG.CONST.MSG_TYPE_HINT, 5000);
                return;
            }

            if (this._setImpressing) {
                QZONE.FP.showMsgbox('正在提交您的描述，请稍候···', MSG.CONST.MSG_TYPE_LOADING, 5000);
                return;
            }

            succCb = succCb || QZFL.emptyFn;
            errCb = errCb || QZFL.emptyFn;
            str = QZFL.string.trim(str);
            if (!str) {
                QZONE.FP.showMsgbox('请输入印象词', MSG.CONST.MSG_TYPE_HINT, 2000);
                return;
            }

            this._setImpressing = true;
            QZONE.FP.showMsgbox('正在提交您的描述，请稍候···', MSG.CONST.MSG_TYPE_LOADING, 5000);

            var _this = this;
            var data = {
                uin: LOGIN_UIN,
                touin: SPACE_UIN,
                effectid: this.serverId, //TODO
                effectcnt: str,
                random: Math.random()
            };

            var fs = new QZFL.FormSender(CGI_COLL.set, null, data, 'UTF-8');
            fs.onSuccess = function(responseData) {
                _this._setImpressing = false;
                var data = responseData.result;
                if (data.code == 0) {
                    parent[k] = true;
                    QZONE.FP.showMsgbox('评价成功', MSG.CONST.MSG_TYPE_SUCC, 2000);
                    _this.showImpressList();
                    succCb();
                } else if (data.code == 204) {
                    QZONE.FP.showMsgbox('对不起！非主人好友，暂不支持描述好友印象', MSG.CONST.MSG_TYPE_ERROR, 2000); //单向好友
                } else if (data.code == 201) {
                    QZONE.FP.showMsgbox('对不起，系统正忙。请稍候提交', MSG.CONST.MSG_TYPE_HINT, 2000);
                } else {
                    QZONE.FP.showMsgbox(data.msg, MSG.CONST.MSG_TYPE_ERROR, 2000);
                }
                QZFL.css.addClassName($('impressActionForm'), 'none');
            };
            fs.onError = function() {
                _this._setImpressing = false;
                QZONE.FP.showMsgbox('对不起，由于网络异常', MSG.CONST.MSG_TYPE_ERROR, 2000);
            };
            fs.send();

            setTimeout(function() {
                _this._setImpressing = false;
            }, 5000);
        },

        /**
         * 删除好友印象
         * @param  {String} str
         * @param  {Function} succCb
         * @param  {Function} errCb
         */
        delImpress: function(str, succCb, errCb) {
            succCb = succCb || QZFL.emptyFn;
            errCb = errCb || QZFL.emptyFn;
            var _this = this;
            var data = {
                uin: LOGIN_UIN,
                effectid: this.serverId,
                effectcnt: str,
                random: Math.random()
            };
            var fs = new QZFL.FormSender(CGI_COLL.del, null, data, 'UTF-8');
            fs.onSuccess = function(responseData) {
                QZONE.FP.showMsgbox('成功删除好友印象', MSG.CONST.MSG_TYPE_SUCC, 2000);
                _this.showImpressList();
                succCb();
            };
            fs.onError = function(msg) {
                QZONE.FP.showMsgbox('对不起，由于网络异常', MSG.CONST.MSG_TYPE_ERROR, 2000);
                errCb(msg);
            };
            fs.send();
        }
    };
    // FriendImpress.init();
})(MSG);
(function(MSG) {
    var FUN_IMG_PATH = 'http://qzonestyle.gtimg.cn/qzone/em/recommendedImages/';
    var DEF_LIST = [
        ['撒花啦', '063.gif', '063_thumb.gif', 100, 100],
        ['福', '002.png', '002_thumb.png', 158, 123],
        ['感动', '145.gif', '145_thumb.gif', 100, 100],
        ['抱一下', '032.gif', '032_thumb.gif', 100, 100],
        ['搞怪', '024.png', '024_thumb.png', 180, 180],
        ['为什么呀', '147.gif', '147_thumb.gif', 100, 100],
        ['得瑟', '148.gif', '148_thumb.gif', 100, 100]
    ];
    var FUN_DATA = [];

    /**
     * 趣味表情模块
     */
    var FunEmotion = {
        panelNode: $('funEmoCon'),
        init: function() {
            var _this = this;
            var defHtml = '<ul class="clearfix">';
            QZFL.each(DEF_LIST, function(f) {
                defHtml += '<li><a title="' + f[0] + '" href="' + FUN_IMG_PATH + f[1] + '" target="_blank">' +
                    '<img alt="' + f[0] + '" _width="' + f[3] + '" _height="' + f[4] + '" _src="' + FUN_IMG_PATH + f[1] + '" src="' + FUN_IMG_PATH + f[2] + '">' +
                    '</a></li>';
            });
            defHtml += '<li class="tlink"><a href="javascript:;" id="moreFunnyEmo">更多</a></li></ul>';
            $('defFunEmoList').innerHTML = defHtml;

            this._bindEvent(this.panelNode);
        },

        /**
         * 拉取趣味表情数据
         * @param  {Number}   pageIndex
         * @param  {Function} callback
         */
        getData: function(pageIndex, callback) {
            if (this._loading) {
                return;
            }

            var _this = this;
            var pageIndex = pageIndex || 1;
            var pageSize = 8;
            var hd = function() {
                var pageTotal = Math.ceil(FUN_DATA.length / pageSize);
                var data = FUN_DATA.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
                callback(data, pageTotal);
            }

            if (!FUN_DATA.length) {
                this._loading = true;
                QZONE.FP.showMsgbox("正在加载数据，请稍候... ", MSG.CONST.MSG_TYPE_LOADING, 10000);
                var jg = new QZFL.JSONGetter('/qzone/v6/v6_config/msgboardemotion.js', void(0), null, 'utf-8');
                jg.onSuccess = function(data) {
                    QZONE.FP.hideMsgbox();
                    QZFL.each(data, function(item) {
                        FUN_DATA.push([item.title, item.fileName, item.thumbFileName, item.width, item.height]);
                    });
                    hd();
                    _this._loading = false;
                };
                jg.onError = function() {
                    _this.__loading = false;
                    QZONE.FP.showMsgbox("好像当前网络堵着呢，阁下等会再来哦... ", MSG.CONST.MSG_TYPE_ERROR, 2000);
                };
                jg.send('_Callback');
            } else {
                hd();
            }
        },

        showPage: function(pageIndex) {
            var _this = this;
            this.getData(pageIndex, function(data, pageTotal) {
                var prePage = pageIndex > 1 ? (pageIndex - 1) : 1;
                var nextPage = pageIndex < pageTotal ? (pageIndex + 1) : '';

                var html = '<b class="uarr"></b><b class="uarr-in"></b> <a href="javascript:;" rel="close" class="icon-close">关闭</a><div class="more-list"><ul class="clearfix">';
                for (var i = 0; i < data.length; i++) {
                    var name = data[i][0];
                    var imageurl = data[i][1];
                    var thumb = data[i][2];
                    var width = data[i][3];
                    var height = data[i][4];
                    var thumbSrc = FUN_IMG_PATH + thumb;
                    var oriSrc = FUN_IMG_PATH + imageurl;
                    html += ['<li><a rel="selectEmotion" alt="' + name + '" _src="' + oriSrc + '" _width="' + width + '" _height="' + height + '" onclick="return false;" href="javascript:;">',
                        '<img rel="selectEmotion" src="' + thumbSrc + '" alt="' + name + '" _src="' + oriSrc + '" _width="' + width + '" _height="' + height + '"/>' + name + '</a></li>'
                    ].join("");
                }
                html += '</ul></div>';
                html += '<div class="pages"><a href="javascript:;" tp="' + prePage + '">上一页</a><span class="count">' + pageIndex + '/' + pageTotal + '</span><a href="javascript:void(0);" tp="' + nextPage + '">下一页</a></div>';

                QZFL.css.removeClassName(_this.panelNode, 'none');
                _this.panelNode.innerHTML = html;
            });
        },

        hide: function() {
            QZFL.css.addClassName(this.panelNode, 'none');
        },

        _bindEvent: function(panelNode) {
            var _this = this;
            QZFL.event.addEvent(panelNode, "click", function(e) {
                var tag = QZFL.event.getTarget(e);
                if (tag.nodeType == 1) {
                    if (tag.getAttribute("rel") == 'selectEmotion') {
                        _this.insertEmotion(tag);
                    }
                    var tp = parseInt(tag.getAttribute('tp'), 10);
                    if (tp) {
                        QZFL.event.preventDefault(e);
                        _this.showPage(tp);
                    }
                }
                if (tag.getAttribute("rel") == "close") {
                    QZFL.event.preventDefault(e);
                    _this.hide();
                }
            });

            QZFL.event.addEvent(document.body, 'mousedown', function(ev) {
                var tag = QZFL.event.getTarget(ev);
                if (!QZFL.dom.contains(panelNode, tag) && tag.id != 'moreFunnyEmo') {
                    _this.hide();
                }
            });

            QZFL.event.addEvent($('defFunEmoList'), 'click', function(e) {
                var tag = QZFL.event.getTarget(e);
                if (tag.nodeType == 1 && tag.tagName == 'IMG') {
                    _this.insertEmotion(tag);
                    QZFL.event.preventDefault(e);
                }
            });

            MSG.comment.onLoad(function(editor) {
                editor.onClick.add(function() {
                    _this.hide();
                });
            });

            $e('#defFunEmoList img').onHover(function() {
                _this.togglePreview(this.getAttribute('_src'), this.alt, true);
            }, function() {
                _this.togglePreview(null, null, false);
            });

            QZFL.event.addEvent($('moreFunnyEmo'), 'click', function() { _this.showPage(1) });

            QZFL.event.addEvent($('funEmoTab'), 'click', function() {
                $e('a', this.parentNode).removeClass('current');
                QZFL.css.addClassName(this, 'current');
                QZFL.css.removeClassName($('defFunEmoList'), 'none');
                QZFL.css.addClassName($('defTiezhiList'), 'none');
            });
        },

        /**
         * 显示、隐藏预览图
         * @param  {String} src
         * @param  {String} title
         * @param  {Boolean} bShow
         */
        togglePreview: function(src, title, bShow) {
            var pc = $('largeFunEmotion');
            QZFL.css[bShow ? 'removeClassName' : 'addClassName'](pc, 'none');
            if (bShow) {
                $e('img', pc).setAttr('src', src);
                $e('.name', pc).setHtml(title);
            }
        },

        insertEmotion: function(tag) {
            var title = tag.getAttribute('alt');
            var src = tag.getAttribute('_src');
            var width = tag.getAttribute('_width');
            var height = tag.getAttribute('_height');
            MSG.comment.insertContent('<img src="' + src + '" alt="' + title + '" width="' + width + '" height="' + height + '"/>');
        }
    };
    FunEmotion.init();
    MSG.FunEmotion = FunEmotion;
})(MSG);
(function(MSG, Comment) {
    var DEF_LIST = '1,2,3,4,5'.split(',');
    var TieZhi = {
        init: function() {
            var defHtml = '<ul class="clearfix">';
            defHtml += '<li class="reset"><a href="javascript:;" rel="selectTiezhi" data="">无</a></li>'
            QZFL.each(DEF_LIST, function(item) {
                defHtml += '<li><a href="' + getTiezhiSrc(item) + '" rel="selectTiezhi" data="' + item + '"><img src="' + getTiezhiSrc(item, true) + '" rel="selectTiezhi" data="' + item + '"></a></li>';
            });
            defHtml += '<li class="tlink none"><a href="javascript:;" rel="moreTieZhi">更多</a></li>';
            defHtml += '</ul>';
            $('defTiezhiList').innerHTML = defHtml;

            this._bindEvent();
        },

        _bindEvent: function() {
            var _this = this;
            QZFL.event.addEvent($('tiezhiTab'), 'click', function() {
                $e('a', this.parentNode).removeClass('current');
                QZFL.css.addClassName(this, 'current');
                QZFL.css.addClassName($('defFunEmoList'), 'none');
                QZFL.css.removeClassName($('defTiezhiList'), 'none');
            });

            QZFL.event.addEvent($('defTiezhiList'), 'click', function(ev) {
                var tag = QZFL.event.getTarget(ev);
                var rel = tag.getAttribute('rel');
                if (rel == 'selectTiezhi') {
                    QZFL.event.preventDefault(ev);
                    _this.setTiezhiToCommentEditor(tag.getAttribute('data'));
                }
            });

            Comment.onBeforeSubmitHooks.push(function() {
                if (Comment.extraParams['pasterid']) {
                    return _this.checkVip();
                }
            });

            Comment.onSuccessCommentHooks.push(function() {
                _this.setTiezhiToCommentEditor();
            });
        },

        /**
         * 设置评论编辑框的贴纸
         * @param {String} imgSrc
         */
        setTiezhiToCommentEditor: function(key) {
            if (key) {
                var imgSrc = getTiezhiSrc(key);
                Comment.showEditor(function(editor) {
                    QZFL.dom.setStyle(editor.iframeElement.parentNode, 'background', 'url(' + imgSrc + ') no-repeat right bottom white');
                });
            } else {
                Comment.showEditor(function(editor) {
                    QZFL.dom.setStyle(editor.iframeElement.parentNode, 'background', 'white');
                });
            }
            Comment.extraParams['pasterid'] = key ? parseInt(key, 10) : null;
        },

        checkVip: function() {
            if (!QZBlog.Util.getLoginIsVIP()) {
                var _dialog = QZONE.FP._t.QZFL.dialog.create("提示信息", { src: "/qzone/msgboard/tiezhi_novip_popup.html" }, {
                    showMask: true,
                    width: 360,
                    height: 130,
                    buttonConfig: [{
                            type: QZFL.dialog.BUTTON_TYPE.Confirm,
                            text: '继续发表'
                        },
                        {
                            type: QZFL.dialog.BUTTON_TYPE.Cancel,
                            text: '取消'
                        }
                    ]
                });
                _dialog.onConfirm = function() {
                    Comment.extraParams['pasterid'] = null;
                    Comment.submitComment();
                };
                return false;
            }
            return true;
        }
    };
    TieZhi.init();
})(MSG, MSG.comment);
(function(MSG, Comment) {
    /**
     * 私密留言
     */
    var showVipDialog = function() {
        var _dialog = QZONE.FP._t.QZFL.dialog.create("提示信息", { src: "/qzone/msgboard/priv_novip_popup.html" }, {
            showMask: true,
            width: 360,
            height: 150,
            buttonConfig: [{
                type: QZFL.dialog.BUTTON_TYPE.Cancel,
                text: '取消'
            }]
        });
    };

    Comment.onBeforeSubmitHooks.push(function() {
        var chk = $('privCheck').checked;
        if (chk) {
            if (!QZONE.FP.isVipUser(true)) {
                showVipDialog();
                return false;
            } else {
                Comment.extraParams['secret'] = 1;
            }
        }
        return true;
    });


    $('privCheckLbl').style.display = IS_OWNER ? 'none' : '';

    QZFL.event.addEvent($('privCheckLbl'), 'mousedown', function(e) {
        if (!QZONE.FP.isVipUser(true)) {
            showVipDialog();
            QZFL.event.preventDefault(e);
            return false;
        }
    });
})(MSG, MSG.comment);
(function(MSG) {
    /**
     * 签名模块
     */
    var Signature = {
        init: function() {
            var _this = this;
            QZFL.event.addEvent($('signCheck'), 'click', function(e) {
                _this.toggleSignature();
            });
            QZFL.event.addEvent($('signCheckLink'), 'click', function() {
                QZFL.event.preventDefault();
                var s = $('signCheck').checked;
                _this.toggleSignature(!s);
                this.innerHTML = s ? '显示签名档' : '隐藏签名档';
                $('signCheck').checked = !s;
            });
        },

        /**
         * 获取签名档数据
         * @param  {Array}   uinList
         * @param  {Function} callback
         */
        getSignatureData: function(uinList, callback) {
            var url = "http://r.qzone.qq.com/cgi-bin/user/cgi_sign_batchget";
            var neq = new QZBlog.Util.NetRequest({ url: url, data: { uinlist: uinList.join('-'), notubb: 1, fupdate: 1 } });
            neq.onSuccess = function(responseData) {
                callback(responseData);
            };
            neq.send();
        },

        /**
         * 显示、隐藏签名档
         * @param  {Boolean} bShow
         */
        toggleSignature: function(bShow) {
            bShow = bShow === undefined ? $('signCheck').checked : !!bShow;
            $("signCheckLabel").title = bShow ? "勾选后隐藏用户签名档" : "勾选后显示用户签名档";
            if (!$e(".signature")) {
                return;
            }
            $e(".signature")[bShow ? 'removeClass' : 'addClass']('none');
            if (!bShow) {
                return;
            }

            var uinList = [];
            QZFL.each($e(".signature").elements, function(item) {
                var uin = item.getAttribute('uin');
                uin && uinList.push(uin)
            })
            if (!uinList.length) {
                return;
            }

            this.getSignatureData(uinList, function(responseData) {
                var data = responseData.data;
                if (!data) {
                    return;
                }
                var sigTags = $e(".signature").elements;
                for (var i = 0; i < sigTags.length; i++) {
                    var uin = sigTags[i].getAttribute("uin");
                    if (!uin) {
                        break;
                    }
                    for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                        if (data[dataIndex].uin == uin) {
                            var str = data[dataIndex].sign;
                            if (!!str) {
                                sigTags[i].innerHTML = str;
                                QZFL.css.removeClassName(sigTags[i], "none");
                            }
                            break;
                        }
                    }
                }
            });
        }
    };
    Signature.init();
    MSG.Signature = Signature;
})(MSG);
(function(MSG) {
    var prefix = IS_OWNER ? "Master." : "Guest.";
    var actionMap = {
        "#btnEditAuthorMsg": prefix + "Header.editdefault",
        "#btnToSet": prefix + "Manager.setting",
        "#btnGotoAudit": prefix + "Manager.sensorship",
        "#btnBatch": prefix + "Manager.batch",
        "#pager_bottom a[id^='pager_num']": prefix + "Manager.certainpage",
        "#pager_bottom a[id^='pager_previous']": prefix + "Manager.prepage",
        "#pager_bottom a[id^='pager_next']": prefix + "Manager.nextpage",
        "#pager_top a[id^='pager_num']": prefix + "Manager.certainpage",
        "#pager_top a[id^='pager_previous']": prefix + "Manager.prepage",
        "#pager_top a[id^='pager_next']": prefix + "Manager.nextpage",

        "#ulCommentList span.skin_portrait_round": prefix + "Column.picture",
        "#ulCommentList a.c_tx.q_namecard": prefix + "Column.picture",
        "#ulCommentList a.qz_qzone_lv": prefix + "Column.fruit",
        "#ulCommentList a[rel='reply']": prefix + "Column.reply",
        "#ulCommentList a[rel='sendGift']": prefix + "Column.gift",
        "#ulCommentList a[rel='quote']": prefix + "Column.quote",
        "#ulCommentList a[rel='edit']": prefix + "Column.edit",
        "#ulCommentList a[rel='delete']": prefix + "Column.delete",
        "#ulCommentList a[rel='report']": prefix + "Column.report",
        "#ulCommentList a[rel='moveBlack']": prefix + "Column.ban",
        "#ulCommentList a[rel='delete']": prefix + "Reply.delete",
        "#ulCommentList button[id$='postButton']": prefix + "Reply.confirm",
        "#ulCommentList a[id$='cancelButton']": prefix + "Reply.cancel",
        "#commentEditorAnchor .veButton_veToolbarSwitcher": prefix + "Edit.highend",

        "#checkSignInput": prefix + "Edit.sign",
        "#btnPostMsg": prefix + "Edit.post",
        "#btnWantPost": prefix + "Bottom.iwant",
        "#defFunEmoList a": prefix + "edit.FunnyEmotion.Box",
        "#funEmoCon ul a": prefix + "edit.FunnyEmotion.Layer",
        "#btnBatchBottom": prefix + "Bottom.batch",
        '#impressActionTriggerBtn': 'guest.friend.add',
        '#impressList a.del': 'master.friend.del',
        '#tiezhiTab': prefix + 'Edit.note_botton',
        'a[rel=prevent_cheat]': 'prevent_cheat_button',
        '#defTiezhiList img': prefix + 'Edit.note_paper'
    };
    QZBlog.Logic.TCISDClick.batchBind(actionMap, {
        url: "/msgboard",
        domain: "msg.qzone.qq.com",
        container: document.body,
        nested: true,
        prepare: true
    });
})(MSG);