var mysql  = require('mysql');

function createDBConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'devshop',
        password: 'ruWOz7',
        database: 'devshop'
    });
}

module.exports = function() {
    return createDBConnection;
}