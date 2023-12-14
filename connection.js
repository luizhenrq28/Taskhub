const mysql = require('mysql2')
require('dotenv').config()

const sql = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
})

module.exports = sql
