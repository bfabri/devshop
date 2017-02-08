var mysql  = require('mysql');

function createDBConnection() {
    if (!process.env.NODE_ENV) {
        return mysql.createConnection({
            host: 'localhost',
            user: 'devshop',
            password: 'ruWOz7',
            database: 'devshop'
        });    
    }

    if (process.env.NODE_ENV == 'test') {
        return mysql.createConnection({
            host: 'localhost',
            user: 'devshop_test',
            password: 'ruWOz7',
            database: 'devshop_test'
        });  
    }
}

module.exports = function() {
    return createDBConnection;
}