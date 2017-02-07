module.exports = function(app) {

    app.post('/developers/developer', function(req, resp) {
        var developer = req.body;
        
        req.assert('name', 'name is required and has a maximum of 50 characters').notEmpty().len(0, 50);
        req.assert('price', 'price is required and must be a decimal value').notEmpty().isFloat();
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
        var developerClient = new app.services.DeveloperClient();
        developerClient.list(function(exception, request, response, result) {
            if (exception) {
                resp.status(500).send(exception);
                return;
            }

            resp.send(result);
        });
    });
}