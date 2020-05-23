console.log('load popup.js')
document.querySelector('#content').addEventListener('click', e => {
    let target = e.target;
    if (target && target.tagName == 'BUTTON') {
        let type = target.getAttribute('data-type');
        console.log(target, type)
        if (type) {
            chrome.extension.getBackgroundPage().notice({type: type});
        }
    }
})