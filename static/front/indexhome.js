let campoinfo = document.querySelector('#campoinfo')
let mensagem = document.querySelector('.mensagem')

//remove mensagem de sucesso ou falha na tela de home
if(mensagem){
    setTimeout(()=>{
        campoinfo.remove(mensagem)
    },3500)
}