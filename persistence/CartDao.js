function CartDao(app) {
    this._app = app;
}

CartDao.prototype.add = function(developer, callback) {
    this._app.persistence.connectionFactory(function(err, connection) {
        connection.query('INSERT INTO developer SET ?', developer, function(errors, results) {
            connection.release();
            callback(errors, results);
        });
    });
}

CartDao.prototype.delete = function(developer, callback) {
    this._app.persistence.connectionFactory(function(err, connection) {
        connection.query('DELETE FROM developer WHERE id = ?', developer.id, function(errors, results) {
            connection.release();
            callback(errors, results);
        });
    });
}

CartDao.prototype.list = function(callback) {
    this._app.persistence.connectionFactory(function(err, connection) {
        connection.query('SELECT * FROM developer', function(errors, results) {
            connection.release();
            callback(errors, results);
        });
    });
}

CartDao.prototype.pick = function(id, callback) {
    this._app.persistence.connectionFactory(function(err, connection) {
        connection.query('SELECT * FROM developer WHERE id = ?', id, function(errors, results) {
            connection.release();
            callback(errors, results);
        });
    });
}

module.exports = function() {
    return CartDao;
}