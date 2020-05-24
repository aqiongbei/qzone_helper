console.log('load popup.js')
document.querySelector('#content').addEventListener('click', e => {
    let target = e.target;
    if (target && target.tagName == 'BUTTON') {
        let action = target.getAttribute('data-action');
        console.log(target, action)
        if (action) {
            chrome.extension.getBackgroundPage().notice({type: action});
        }
    }
})