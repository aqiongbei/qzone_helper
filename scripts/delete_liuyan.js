window.totalNum = 0;
window.nowNum = 0;
window.isFirst = true;
function go(index)　 {
    (function(index) {
        setTimeout(function() {
            MSG.list.getPageData(index, function(data) {
            	if (isFirst) {
                	window.totalNum = data.total;
            		window.isFirst = false;
            	} else {
            		window.totalNum = data.total;
            	}
        		var arrId = [];
        		for (var item of data.items) { arrId.push(item.id) };
        		(function(arrId, index) {
        		    deleteMsg(arrId);
        		    if (index < 149) {
        		        go(++index)
        		    }
        		})(arrId, index);
            })
        }, 1500);
    })(index)
}

function deleteMsg(arrId) {
    var _url = MSG.util.getUrl("delanswer");
    var _this = MSG.list;
    var _arrUin = [];
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
    };
    Request.onError = function (resopnseData) {
    	return window.location.reload();
    }
    Request.send()
}
go(1)