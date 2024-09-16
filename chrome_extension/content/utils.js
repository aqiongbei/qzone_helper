console.log("utils.js loaded");

let timer = null;

window.utils = {
  showTips(msg, type = "info") {
    // "succeed", "fail", "loading"
    let popup_el = document.querySelector(".ui-popup");
    if (!popup_el) {
      popup_el = document.createElement("div");
      popup_el.role = "dialog";
      popup_el.tabindex = -1;
      popup_el.className = "ui-popup ui-popup-show ui-popup-focus";
      popup_el.style.display = "none";
      popup_el.style.position = "fixed";
      popup_el.style.left = "50%";
      popup_el.style.top = "40%";
      popup_el.style.transform = "translate(-50%, -50%)";
      popup_el.style.bottom = "auto";
      popup_el.style.right = "auto";
      popup_el.style.margin = "auto";
      popup_el.style.padding = "auto";
      popup_el.style.outline = 0;
      popup_el.style["z-index"] = 999990;
      popup_el.style.border = "0 none";
      popup_el.style.background = "transparent";
      document.body.appendChild(popup_el);
    }
    let str = `<div class="qz-tips-box qz-tips-box-m"><div class="tips-box-txt tips-${type}"><i class="icon-${type}-m"></i>${msg}</div></div>`;
    popup_el.innerHTML = str;
    // 消息提示已经关闭了
    if (popup_el.style.display == "none") {
      popup_el.style.display = "block";
    }
    // 实现带有队列的消息提示
    // 通过队列展示消息,保证消息展示的连续性
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      let popupEl = document.querySelector(".ui-popup");
      if (popupEl) {
        popupEl.style.display = "none";
      }
    }, 3000);
  },
  serialize(obj) {
    let result = "";
    for (let key in obj) {
      if (result === "") {
        result += key + "=" + obj[key];
      } else {
        result += "&" + key + "=" + obj[key];
      }
    }
    return result;
  },
  getCookie(key) {
    let arr = document.cookie.split("; ");
    let cookie = {};
    arr.map((item) => {
      let v = item.split("=");
      cookie[v[0]] = v[1];
    });
    if (key) {
      return cookie[key];
    } else {
      return cookie;
    }
  },
  getGTK() {
    let cookie = this.getCookie();
    let t = cookie.p_skey || cookie.skey || cookie.rv2;
    let n = 5381;
    for (let i = 0, o = t.length; i < o; ++i) {
      n += (n << 5) + t.charAt(i).charCodeAt();
    }
    return n & 2147483647;
  },
  getBaseInfo() {
    let info = {};
    info.g_tk = this.getGTK();
    info.reffer = window.location.href;
    for (let el of document.scripts) {
      // token
      let text = el.innerText;
      let target_text = "window.g_qzonetoken = (function(){ try{return";
      if (text && text.includes(target_text)) {
        let token = /"([^;]+)"/.exec(text)[1];
        info.token = token;
      }
      // uin
      target_text = "g_iUin=";
      if (text && text.includes(target_text)) {
        let uin = /(\d+),/.exec(text)[1];
        info.uin = uin;
      }
    }
    console.log(info);
    return info;
  },
  request(options, cb) {
    let xhr = new XMLHttpRequest();
    let qs = options.qs;
    if (qs) {
      let str = "?";
      for (let key in qs) {
        if (str === "?") {
          str += key + "=" + qs[key];
        } else {
          str += "&" + key + "=" + qs[key];
        }
      }
      options.url += str;
    }
    xhr.open(options.method, options.url, true);
    if (options.method == "GET") {
      xhr.setRequestHeader("Content-Type", "text/html; charset=utf-8");
    } else {
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=UTF-8"
      );
    }
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
      if (
        xhr.readyState === 4 &&
        (/^2\d{2}/.test(xhr.status) || xhr.status === 304)
      ) {
        if (xhr.response) {
          let data = xhr.response;
          try {
            data = JSON.parse(xhr.response);
          } catch (e) {}
          cb && cb(data);
        }
      }
    };
    xhr.send(this.serialize(options.data));
  },
  download(data, filename, cb) {
    let b = new Blob([data], { type: "applaction/json" });
    let download_url = URL.createObjectURL(b);
    let el = document.createElement("a");
    el.style = "display:none";
    el.href = download_url;
    el.download = filename;
    document.body.appendChild(el);
    el.click();
    setTimeout(() => {
      // 通过createObjectURL创建的url需要通过revokeObjectURL()来释放
      URL.revokeObjectURL(download_url);
      el.href = "";
      cb && cb();
    });
  },
  stringify(data, type = "talk") {
    // switch (type) {
    //     case 'talk':
    //         // data.
    // }
  },
  next(cb) {
    if (window.stop_task) {
      this.showTips(`任务已经终止!`);
    } else {
      cb();
    }
  },
};
