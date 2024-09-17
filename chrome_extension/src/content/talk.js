console.log("talk.js loaded");
if (!window.TASK) {
  window.TASK = {};
}
window.TASK.talk = {
  getTalk(opt, cb) {
    let config = {
      url: "https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6",
      method: "GET",
      qs: {
        uin: base_info.uin,
        inCharset: "utf-8",
        outCharset: "utf-8",
        hostUin: base_info.uin,
        notice: 0,
        sort: 0,
        pos: 0,
        num: 20,
        cgi_host:
          "https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6",
        code_version: 1,
        format: "json",
        need_private_comment: 1,
        g_tk: base_info.g_tk,
        qzonetoken: base_info.token,
        g_tk: base_info.g_tk,
      },
    };
    if (opt && opt.qs) {
      config.qs = Object.assign(config.qs, opt.qs);
    }
    if (opt && opt.data) {
      config.data = Object.assign(config.data, opt.data);
    }
    utils.request(config, function (res) {
      utils.showTips(
        `获取说说列表成功! 当前进度: ${window.talk_list.length} / ${res.total}条数据`
      );
      cb && cb(res);
    });
  },
  deleteTalk() {
    let list = window.talk_list.splice(0, 1);
    list.map((msg) => {
      if (!msg.tid) return;
      utils.request(
        {
          url: "https://user.qzone.qq.com/proxy/domain/taotao.qzone.qq.com/cgi-bin/emotion_cgi_delete_v6",
          method: "POST",
          qs: {
            qzonetoken: base_info.token,
            g_tk: base_info.g_tk,
          },
          data: {
            hostuin: base_info.uin,
            tid: msg.tid,
            t1_source: 1,
            code_version: 1,
            format: "fs",
            qzreferrer: base_info.reffer,
          },
        },
        function (res) {
          if (res.includes('"code":0')) {
            utils.showTips(`删除说说${msg.tid}成功!`);
          } else if (res.includes('"code":-3001')) {
            utils.showTips(
              `删除说说失败!操作频繁需要验证.任务已暂停,请稍后重试!`,
              "fail"
            );
            window.stop_task = true;
            window.talk_list = [];
          } else if (res.includes("请先登录空间")) {
            utils.showTips(
              `删除说说失败!操作异常被锁定.任务已暂停,请稍后重试!`,
              "fail"
            );
            window.stop_task = true;
            window.talk_list = [];
          } else {
            utils.showTips(`删除说说${msg.tid}失败!\n${res}`);
          }
        }
      );
    });
    utils.next(() => {
      setTimeout(() => {
        if (window.talk_list && window.talk_list.length) {
          this.deleteTalk();
        } else {
          this.delete();
        }
      }, 500);
    });
  },
  export() {
    let foo = (res) => {
      console.log("cb", res);
      if (res.total) {
        window.talk_list = window.talk_list.concat(res.msglist);
      }
      if (window.talk_list.length >= res.total) {
        utils.download(
          JSON.stringify(window.talk_list, 4, " "),
          `talk_list.json`
        );
        window.talk_list = [];
        utils.showTips("导出说说完成!", "succeed");
      } else {
        let opt = {
          qs: {
            pos: window.talk_list.length,
          },
        };
        utils.next(() => {
          this.getTalk(opt, foo);
        });
      }
    };
    this.getTalk(null, foo);
  },
  delete() {
    let foo = (res) => {
      console.log("cb", res);
      if (res.total) {
        window.talk_list = res.msglist;
        utils.next(() => {
          this.deleteTalk();
        });
      } else {
        utils.showTips("删除说说完成!", "succeed");
        window.location.reload();
      }
    };
    this.getTalk(null, foo);
  },
};
