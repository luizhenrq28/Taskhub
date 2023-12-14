const express = require('express')
const app = express()
const sql = require('../connection')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser');
//configs--
const bcrypt = require('bcrypt')
require('dotenv').config()

//handle
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views/')
//--
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'))

//------------>functions
let obterToken = (req) => {
    let token = req.headers.cookie.split('; ').find((e) => e.startsWith('token')).split('=')[1]
    return token
}

let verificarToken = (req, res, next) => {
    try {
        var tokenVindoDoCliente = obterToken(req)
    } catch (error) {
        tokenVindoDoCliente = undefined
    }

    jwt.verify(tokenVindoDoCliente, process.env.SECRET, (err) => {
        if (err) {
            res.send('login required again')
        } else {
            next()
        }
    })
}

let obterNome = function (req) {
    return req.headers.cookie.split('; ').find((e) => e.startsWith('username')).split('=')[1].split('%20')[0]
}
let obterID = (req) => {
    let token = req.headers.cookie.split('; ').find((e) => e.startsWith('token')).split('=')[1]
    let userId = jwt.decode(token).userid
    return Number(userId)
}
//------------->

module.exports = {

    renderHome: (_, res) => {
        res.render('home')
    },

    renderRegistrar: (_, res) => {
        res.render('registrar')
    },

    registrar: async (req, res) => {
        const dados = { nome: req.body.nome, email: req.body.email, senha: req.body.senha }
        let emailDados = [dados.email]
        let senha = await bcrypt.hash(dados.senha, 10)

        if (!dados.nome) return res.render('registrar', { msgErro: 'requer nome para cadastrar!' })
        if (!dados.email) return res.render('registrar', { msgErro: 'requer email para cadastrar!' })
        if (!dados.senha) return res.render('registrar', { msgErro: 'requer senha para cadastrar!' })

        sql.execute('select email from cadastros where email=?', emailDados, async (err, result) => {
            if (err) return console.log('erro')

            if (!result[0]) {
                let values = [dados.nome, dados.email, senha]
                sql.execute('insert into cadastros(nome, email, senha) values (?,?,?)', values, (err) => {
                    if (err) return console.log(err)

                    res.render('home', { msg: 'Cadastrado com Sucesso!' })
                })
            } else {
                res.render('registrar', { msgErro: 'Falha ao se Registrar!' })
            }
        })
    },

    renderLogin: (_, res) => {
        res.render('login')
    },

    login: (req, res) => {
        const dados = { email: req.body.email, senha: req.body.senha }
        let emailDados = [dados.email]
        if (dados.email && dados.senha) {
            sql.execute('select id, nome, email, senha from cadastros where email=?', emailDados, async (err, result) => {
                if (err) throw err
                if (result[0] === undefined) {
                    res.render('login', { msgErro: 'O login é inválido' })
                } else {
                    let senha = await result[0].senha
                    bcrypt.compare(dados.senha, senha, (err, data) => {
                        if (err) throw err

                        if (data) {
                            let secret = process.env.SECRET
                            let token = jwt.sign({ userid: result[0].id }, secret, { expiresIn: '1d' })

                            if (req.headers.cookie) {
                                try {
                                    var tokenVindoDoCliente = req.headers.cookie.split('=')[1]
                                } catch (error) {
                                    tokenVindoDoCliente = undefined
                                }
                                jwt.verify(tokenVindoDoCliente, process.env.SECRET, (err) => {
                                    if (err) {
                                        res.cookie('token', token, 30000)
                                        res.cookie('username', result[0].nome, 30000)
                                    }
                                })
                            } else {
                                res.cookie('token', token, 30000)
                                res.cookie('username', result[0].nome, 30000)
                            }
                            res.redirect('/principal')
                        } else {
                            res.render('login', { msgErro: 'O login é inválido' })
                        }
                    })
                }
            })
        }
    },

    renderPrincipal: (req, res) => {
        try {
            let nome = obterNome(req)
            res.render('principal', { nome: nome })
        } catch {
            res.send('ERROR')
        }
    },

    renderPrefil: (req, res) => {
        let userId = obterID(req)
        sql.execute('select id, nome, email from cadastros where id = ?', [userId], (err, result) => {
            if (err) throw err
            let [dados] = result
            res.render('perfil', { dados: dados })
        })
    },

    editaDadosPessoais: (req, res) => {
        let dados = [req.body.nome, req.body.email]
        let userId = obterID(req)

        if (dados[0] != '' && dados[1] != '') {
            sql.execute('select cadastros.nome, cadastros.email from cadastros', (err, result) => {
                
                if (err) throw err

                let emailEstaEmUso = result.find(e => e.email == dados[1])
                if (emailEstaEmUso) {
                    if (emailEstaEmUso.email === dados[1]) {
                        sql.execute('update cadastros set cadastros.nome = ?, cadastros.email = ? where cadastros.id = ?', [dados[0], dados[1], Number([userId])], (err) => {
                            if (err) throw err

                            res.cookie('msg', 'Dados alterados!', 30000)
                            res.redirect('/perfil')
                        })
                    } else {
                        res.cookie('msg', 'Falha ao alterar Dados!', 30000)
                        res.redirect('/perfil')
                    }
                } else {
                    sql.execute('update cadastros set cadastros.nome = ?, cadastros.email = ? where cadastros.id = ?', [dados[0], dados[1], Number([userId])], (err) => {
                        if (err) throw err

                        res.cookie('msg', 'Dados alterados!', 30000)
                        res.redirect('/perfil')
                    })
                }
            })
        } else {
            res.cookie('msg', 'Preencha todos os campo!')
            res.redirect('/perfil')
        }
    },

    alteraSenha: (req, res) => {
        let senhaatual = req.body.senhaAtual
        let novasenha = req.body.novaSenha
        let novasenha1 = req.body.novaSenhaRepetida

        let idUsuario = obterID(req)
        sql.execute('select cadastros.senha from cadastros where cadastros.id = ?', [idUsuario], async (err, result) => {
            if (err) throw err

            let { senha } = result[0]
            let senhaIgual = await bcrypt.compare(senhaatual, senha)
            if (!senhaIgual) {
                res.cookie('mensagem', "falha ao alterar senha (senhas diferentes)!")
                res.redirect('/perfil')
            } else {
                let novasenhaiguais = novasenha === novasenha1
                if (novasenhaiguais) {
                    let senha = await bcrypt.hash(novasenha, 10)
                    sql.execute('update cadastros set senha = ? where id = ?', [senha, idUsuario], (err) => {
                        if (err) throw err
                        res.cookie('mensagem', "senha alterada com sucesso!")
                        res.redirect('/perfil')
                    })
                }
            }
        })
    },

    renderTarefas: (req, res) => {
        let userId = obterID(req)

        sql.execute('select id,tarefa from tarefas where id_usuario = ?', [userId], (err, result) => {
            if (err) throw err
            res.render('tarefas', { tarefa: result })
        })
    },

    cadastraTarefas: (req, res) => {
        let userId = obterID(req)
        let tarefa = req.body.tarefa

        sql.execute('insert into tarefas(tarefa, id_usuario) values (?,?)', [tarefa, userId], (err) => {
            if (err) throw err
            res.redirect('/tarefas')
        })
    },

    renderEditar: (req, res) => {
        let username = obterNome(req)
        let id = req.params.id

        sql.execute('select tarefas.id, tarefas.tarefa from tarefas inner join cadastros on cadastros.id = tarefas.id_usuario where cadastros.nome = ?', [username], (err, result) => {
            if (err) throw err

            let elementoComIdInseridoPeloUsuario = result.find(e => e.id == id)
            if (elementoComIdInseridoPeloUsuario) {
                res.render('editar', { id: id, tarefa: elementoComIdInseridoPeloUsuario.tarefa })
            } else {
                res.send('alteracao detectada!')
            }
        })
    },

    logicaEditar: (req, res) => {
        let id = Number(req.params.id)
        let textoEditado = req.body.tarefa

        sql.execute('update tarefas set tarefa = ? where id = ?', [textoEditado, id], (err) => {
            if (err) throw err

            res.redirect('/tarefas')
        })
    },

    deletarTarefa: (req, res) => {
        let id = Number(req.params.id)

        sql.execute('delete from tarefas where id = ?', [id], (err) => {
            if (err) throw err
            res.redirect('/tarefas')
        })
    },

    logout: (_, res) => {
        res.cookie('username', null, { expires: new Date(Date.now() + 1) })
        res.cookie('token', null, { expires: new Date(Date.now() + 1) })
        res.redirect('/')
    },

    obterID: obterID,
    obterNome: obterNome,
    obterToken: obterToken,
    verificarToken: verificarToken
}


