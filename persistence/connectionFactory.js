var mysql  = require('mysql');

var pool = null;

function createDBConnectionPool() {
    if (!process.env.NODE_ENV) {
        pool = mysql.createPool({
            connectionLimit: 100,
            host: 'localhost',
            user: 'devshop',
            password: 'ruWOz7',
            database: 'devshop'
        });    
    }

    if (process.env.NODE_ENV == 'test') {
        pool = mysql.createPool({
            connectionLimit: 100,
            host: 'localhost',
            user: 'devshop_test',
            password: 'S8W424',
            database: 'devshop_test'
        });  
    }

    if (process.env.NODE_ENV == 'production') {
        var connectionUrl = process.env.CLEARDB_DATABASE_URL;
        var groups = connectionUrl.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?reconnect=true/);
        pool = mysql.createPool({
            connectionLimit: 10,
            host: groups[3],
            user: groups[1],
            password: groups[2],
            database: groups[4]
        });  
    }
}

createDBConnectionPool();

var connectMySQL = function(callback) {

    return pool.getConnection(function (err, connection) {
        if(err) {
            console.log('Error getting mysql_pool connection: ' + err);
            pool.end(function onEnd(error) {
                if(error) {
                    console.log('Erro ao terminar o pool: ' + error);
                }
                createDBConnectionPool();
            });
            return;
        }
        return callback(null, connection);
    });
};

module.exports = function() {
    return connectMySQL;
}