const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/', controller.renderHome)

router.get('/registrar', controller.renderRegistrar)

router.post('/registrar', controller.registrar)

router.get('/login', controller.renderLogin)

router.post('/login', controller.login)

router.get('/principal', controller.renderPrincipal)

router.get('/perfil', controller.verificarToken, controller.renderPrefil)

router.post('/editarDadosPessoais', controller.editaDadosPessoais)

router.post('/alterarSenha', controller.alteraSenha)

router.get('/tarefas',controller.verificarToken, controller.renderTarefas)

router.post('/cadastratarefa', controller.cadastraTarefas)

router.get('/editar/:id', controller.renderEditar)

router.post('/editar/:id', controller.logicaEditar)

router.get('/deletar/:id', controller.deletarTarefa)

router.get('/sair', controller.logout)

module.exports = router