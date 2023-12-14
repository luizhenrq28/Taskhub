const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'))

//handle
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views/')
//--

const rotas = require('../src/routes/routes')
app.use('/', rotas)

app.listen(3000, () => console.log('rodando!'))