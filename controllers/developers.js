var async = require('async');

module.exports = function(app) {
    
    app.get('/developers', function(req, resp) {
        var org = req.query.org;

        var developerClient = new app.services.DeveloperClient();
        developerClient.list(org, function(exception, request, response, results) {
            if (exception) {
                resp.status(500).send(exception);
                return;
            }

            var developers = [];
            async.forEach(results, function(result, callback) {
                developerClient.findByUserName(result.login, function(err, reqq, respp, developer) {
                    if (developer) {
                        developers.push({
                            id: developer.id,
                            name: developer.login,
                            avatar_url: developer.avatar_url,
                            price: 100 * (((4*developer.followers) + (3*developer.public_repos) + (2*developer.public_gists) + developer.following)/10)
                        });
                    }
                    callback();
                });
            }, function(error) {
                if (error) {
                    resp.status(500).send(error);
                    return;
                }

                resp.status(200).send(developers);
            });
        });
    });
}