function DeveloperDao(connection) {
    this._connection = connection;
}

DeveloperDao.prototype.save = function(developer, callback) {
    this._connection.query('INSERT INTO developer SET ?', developer, callback);
}

DeveloperDao.prototype.delete = function(developer, callback) {
    this._connection.query('DELETE FROM developer WHERE id = ?', developer.id, callback);
}

module.exports = function() {
    return DeveloperDao;
}