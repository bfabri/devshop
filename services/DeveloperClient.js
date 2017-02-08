var restify = require('restify');

function DeveloperClient() {
    this._client = restify.createJsonClient({
        url: 'https://api.github.com',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token f57f40152941116580ad52a4fdaeb9350b0656b1'     
        },
    });
}

DeveloperClient.prototype.list = function(org, callback) {
    var endpoint = '/users';
    if (org) {
        endpoint = '/orgs/' + org + '/members';
    }
    this._client.get(endpoint, callback);
}

DeveloperClient.prototype.findByUserName = function(username, callback) {
    this._client.get('/users/' + username, callback);
}

module.exports = function() {
    return DeveloperClient;
}