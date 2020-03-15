console.log('load popup.js')
document.addEventListener('DOMContentLoaded', () => {
    console.log('load over')
    document.querySelector('#del_talks').onclick = function () {
        console.log('delete talks')
    }
    document.querySelector('#del_comments').onclick = function () {
        console.log('delete comments')
    }
});