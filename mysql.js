const mysql = require('mysql');

const DB_USER = "asfnmjsp_check"
const DB_PASS = "Saisandeep1811"
const DB_NAME = "asfnmjsp_Check"

const connection = mysql.createPool({
    host     : '172.105.10.159',
    port     : '3306',
    user     : DB_USER,
    password : DB_PASS,
    database : DB_NAME,
});

console.log(connection)