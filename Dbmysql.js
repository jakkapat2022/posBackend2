const mysql = require('mysql')
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

function connect_db(){
    connection.connect((err) => {
        if(err){
            console.log(err);
            return;
        }
        console.log('connect success fully');
    })
}

module.exports = { connect_db ,connection }
