console.log('load background.js');
// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(callback) callback(tabs.length ? tabs[0].id: null);
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
    sendResponse({is_recive: true, orion: 'background.js'});
})

function notice (opt) {
    msg2Content(opt);
}