var async = require('async');

module.exports = function(app) {

    app.post('/developers/developer', function(req, resp) {
        var developer = req.body;
        
        req.assert('name', 'name is required').notEmpty();
        req.assert('name', 'name must has a maximum of 50 characters').len(0, 50);
        req.assert('price', 'price is required').notEmpty();
        req.assert('price', 'price must be a decimal value').isFloat();
        req.getValidationResult().then(function(result) {
            if (!result.isEmpty()) {
                resp.status(400).send(result.array());
                return;
            }

            var connection = app.persistence.connectionFactory();
            var developerDao = new app.persistence.DeveloperDao(connection);
            developerDao.save(developer, function(exception, result) {
                if (exception) {
                    resp.status(500).send(exception);
                    return;
                }

                developer.id = result.insertId;
                resp.status(201).send(developer);
            });
        });
    });

    app.delete('/developers/developer/:id', function(req, resp) {
        req.assert('id', 'id is required and must be a integer value').notEmpty().isInt();
        req.getValidationResult().then(function(result) {
            if(!result.isEmpty()) {
                resp.status(400).send(result.array());
                return;
            }

            var developer = {id: req.params.id};

            var connection = app.persistence.connectionFactory();
            var developerDao = new app.persistence.DeveloperDao(connection);
            developerDao.delete(developer, function(exception, result) {
                if (exception) {
                    resp.status(500).send(exception);
                    return;
                }

                resp.status(200).send(developer);
            });
        }); 
    });

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