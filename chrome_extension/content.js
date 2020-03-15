console.log('content js loaded');
let sc = document.createElement('script');
sc.setAttribute('type', 'text/javascript');
sc.innerHTML = `
console.log('get page value')
let el = document.createElement('p');
el.setAttribute('id', 'value_text');
el.innerText = window.location.href;
document.body.appendChild(el);`;
document.body.appendChild(sc);

setTimeout( () => {
    console.log(document.querySelector('#value_text').innerText)
}, 2000)