module.exports = function(app) {

    app.post('/cart/developer', function(req, resp) {
        var developer = req.body;
        
        req.assert('id', 'id is required').notEmpty();
        req.assert('id', 'id must be a integer value').isInt();
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
            var cartDao = new app.persistence.CartDao(connection);
            cartDao.pick(developer.id, function(exception, dbDeveloper) {
                if (exception) {
                    resp.status(500).send(exception);
                    return;
                }

                if (dbDeveloper && dbDeveloper.length > 0) {
                    resp.status(400).send([{param: 'id', msg: 'developer is already in cart'}]);
                    return;
                }

                cartDao.add(developer, function(exception2, result) {
                    if (exception2) {
                        console.log(exception2);
                        resp.status(500).send(exception2);
                        return;
                    }

                    resp.status(201).send(developer);
                    connection.end();
                });
            });
        });
    });

    app.delete('/cart/developer/:id', function(req, resp) {
        req.assert('id', 'id is required and must be a integer value').notEmpty().isInt();
        req.getValidationResult().then(function(result) {
            if(!result.isEmpty()) {
                resp.status(400).send(result.array());
                return;
            }

            var developer = {id: req.params.id};

            var connection = app.persistence.connectionFactory();
            var cartDao = new app.persistence.CartDao(connection);
            cartDao.delete(developer, function(exception, result) {
                if (exception) {
                    resp.status(500).send(exception);
                    return;
                }

                resp.status(200).send(developer);
                connection.end();
            });
        }); 
    });

    app.get('/cart/developers', function(req, resp) {
        var connection = app.persistence.connectionFactory();
        var cartDao = new app.persistence.CartDao(connection);
        cartDao.list(function(exception, developers) {
            if (exception) {
                resp.status(500).send(exception);
                return;
            }

            resp.status(200).send(developers);
            connection.end();
        });
    });
}