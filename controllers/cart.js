module.exports = function(app) {

    app.post('/cart/developer', function(req, resp) {
        var developer = req.body;
        
        req.assert('name', 'name is required and has a maximum of 50 characters').notEmpty().len(0, 50);
        req.assert('price', 'price is required and must be a decimal value').notEmpty().isFloat();
        req.getValidationResult().then(function(result) {
            if (!result.isEmpty()) {
                resp.status(400).send(result.array());
                return;
            }

            var connection = app.persistence.connectionFactory();
            var cartDao = new app.persistence.CartDao(connection);
            cartDao.add(developer, function(exception, result) {
                if (exception) {
                    resp.status(500).send(exception);
                    return;
                }

                developer.id = result.insertId;
                resp.status(201).send(developer);
            });
            connection.end();
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
            });
            connection.end();
        }); 
    });

    app.get('/cart', function(req, resp) {
        var connection = app.persistence.connectionFactory();
        var cartDao = new app.persistence.CartDao(connection);
        cartDao.pick(function(exception, developers) {
            if (exception) {
                resp.status(500).send(exception);
                return;
            }

            resp.status(200).send(developers);
        });
        connection.end();
        
    });
}