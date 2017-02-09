function CartDao(connection) {
    this._connection = connection;
}

CartDao.prototype.add = function(developer, callback) {
    this._connection.query('INSERT INTO developer SET ?', developer, callback);
}

CartDao.prototype.delete = function(developer, callback) {
    this._connection.query('DELETE FROM developer WHERE id = ?', developer.id, callback);
}

CartDao.prototype.pick = function(callback) {
    this._connection.query('SELECT * FROM developer', callback);
}

module.exports = function() {
    return CartDao;
}