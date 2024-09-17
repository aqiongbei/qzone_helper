console.log("content_scripts loaded");

import "./comment";
import "./talk";
import "./utils";

function injectUI() {
  let { name, author, version, homepage_url } = chrome.runtime.getManifest();
  let wrapperEl = document.createElement("div");
  wrapperEl.setAttribute("id", "qzone_helper-wrapper");
  wrapperEl.innerHTML = `
    <div class="top"><h3>${name}</h3><span id="qzone_helper-closeBtn">关闭</span></div>
    <hr/>
    <button data-action="export_talk" title="将说说的请求数据导出为json格式的文本,包含评论">
      导出说说
    </button>
    <button data-action="delete_talk" class="warn">删除说说</button>
    <br />
    <br />
    <button data-action="export_comment" title="将留言的请求数据导出为json格式的文本,包含评论">
      导出留言
    </button>
    <button data-action="delete_comment" class="warn">删除留言</button>
    <br />
    <br />
    <button data-action="stop_all" class="long">终止任务</button>
    <hr/>
    <footer>version: ${version} author: ${author} <a href=${homepage_url}>Github</a></footer>
    `;
  document.body.appendChild(wrapperEl);

  wrapperEl.addEventListener("click", function (e) {
    console.log("e", e);
    e.target.disabled = true;
    let action = e.target.getAttribute("data-action");
    if (action) {
      dispatch(action);
    }
  });

  document
    .getElementById("qzone_helper-closeBtn")
    .addEventListener("click", function () {
      document.body.removeChild(wrapperEl);
    });
}

function preCheck() {
  // https://rc.qzone.qq.com/infocenter?via=toolbar&_t_=0.3928029360436276&
  // to
  // https://user.qzone.qq.com/xxx
  if (!window.location.href.includes("user.qzone.qq.com")) {
    window.location.href = "https://qzone.qq.com";
  }
}

function init() {
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

const TASK_TYPE = {
  export_talk: {
    key: "export_talk",
    name: "导出说说",
  },
  delete_talk: {
    key: "delete_talk",
    name: "删除说说",
  },
  export_comment: {
    key: "export_comment",
    name: "导出留言",
  },
  delete_comment: {
    key: "delete_comment",
    name: "删除留言",
  },
  export_blog: {
    key: "export_blog",
    name: "导出日志",
  },
  delete_blog: {
    key: "delete_blog",
    name: "删除日志",
  },
  export_photo: {
    key: "export_photo",
    name: "导出相册",
  },
  delete_photo: {
    key: "delete_photo",
    name: "删除相册",
  },
  delete_all: {
    key: "delete_all",
    name: "一键清空说说+留言+日志+相册",
  },
};

function dispatch(action) {
  preCheck();
  init();

  if (action == "stop_all") {
    window.stop_task = true;
    utils.showTips(`终止任务成功!`, "succeed");
    return;
  }

  utils.showTips(`开始处理 < ${TASK_TYPE[action].name} > 任务`);
  switch (action) {
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
    default:
      utils.showTips(`暂不支持 < ${TASK_TYPE[action].name} > 任务`);
      break;
  }
}

injectUI();
