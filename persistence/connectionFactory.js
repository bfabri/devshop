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
            password: 'S8W424',
            database: 'devshop_test'
        });  
    }

    if (process.env.NODE_ENV == 'production') {
        var connectionUrl = process.env.CLEARDB_DATABASE_URL;
        var groups = connectionUrl.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?reconnect=true/);
        return mysql.createConnection({
            host: groups[3],
            user: groups[1],
            password: groups[2],
            database: groups[4]
        });  
    }
}

module.exports = function() {
    return createDBConnection;
}