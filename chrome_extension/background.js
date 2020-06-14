// chrome.runtime.onInstalled.addListener(function() {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         console.log('page change')
//         chrome.declarativeContent.onPageChanged.addRules([{
//             conditions: [
//                 new chrome.declarativeContent.PageStateMatcher({
//                     pageUrl: {
//                         hostContains: 'qq.com'
//                     }
//                 })
//             ],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//     });
// });
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'qq.com' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

chrome.tabs.onSelectionChanged.addListener(function(){
    console.log(chrome)
    chrome.tabs.query({active: true}, function (tab) {
        console.log('tab', tab);
    });
    // if (tab.url.toLowerCase().indexOf("zhihu.com") > -1){
    //     chrome.pageAction.show(id);
    // }
});
console.log('load background.js');
// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

function msg2Content(message, callback) {
    getCurrentTabId((tab_id) => {
        chrome.tabs.sendMessage(tab_id, message, function(response) {
            console.log('background.js recive response:', response)
        });
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('background.js recive:', request)
    sendResponse({ is_recive: true, orion: 'background.js' });
})

function notice(opt) {
    msg2Content(opt);
}