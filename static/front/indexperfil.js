try {
    var valorToken = document.cookie.split('; ').find(e => e.startsWith('msg')).split('=')[1].replaceAll('%20', ' ')
    var nomeToken = document.cookie.split('; ').find(e => e.startsWith('msg')).split('=')[0]
} catch (error) {}

let campoMensagem = document.querySelector('#campoMensagem')
if (nomeToken) {
    let btn = document.createElement('button')
    btn.classList.add('p-3', 'text-info-emphasis', 'bg-info-subtle', 'border', 'border-info-subtle', 'rounded-3')
    btn.innerText = valorToken
    campoMensagem.append(btn)
    
    setTimeout(() => {
        campoMensagem.remove(valorToken)
        document.cookie = `${nomeToken}=; expires=${new Date(Date.now())}`
    }, 3000)
}