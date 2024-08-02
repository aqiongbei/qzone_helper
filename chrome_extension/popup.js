console.log('load popup.js')
document.querySelector('#content').addEventListener('click', e => {
    let target = e.target;
    if (target && target.tagName == 'BUTTON') {
        let action = target.getAttribute('data-action');
        console.log(target, action)
        if (action) {
            if (['delete_talk', 'delete_comment'].includes(action)) {
                target.disabled = true;
            }
            notice({type: action});
        }
    }
})
var activeTabId;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  activeTabId = activeInfo.tabId;
});

// https://bugs.chromium.org/p/chromium/issues/detail?id=462939
function getActiveTab(callback) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        let tab = tabs[0];
        if (tab) {
            callback(tab.id);
        } else {
            chrome.tabs.get(activeTabId, function (tab) {
                if (tab) {
                    callback(tab.id);
                } else {
                    console.log('No active tab identified.');
                }
            });
        }
    });
}

function popup2Content(message, callback) {
    getActiveTab(function (tab_id) {
        console.log('tab_id', tab_id)
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
    popup2Content(opt);
}