var express = require('../config/custom-express')();
var req = require('supertest')(express);
var assert = require('assert');

describe('CartController', function() {
    beforeEach(function(done) {
        this.timeout(5000);

        var conn = express.persistence.connectionFactory();
        conn.query("TRUNCATE TABLE developer", function(err, result) {
            if(!err) {
                done();
            }
        });
        conn.end();
    });

     it('adding developer to cart withou name', function(done) {
        req.post('/cart/developer')
            .send({id: 1, name: "", price: 321.32})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 1);
                assert.equal(resp.body[0].param, 'name');
                assert.equal(resp.body[0].msg, 'name is required');
                done();
            });
    });

    it('adding developer to cart with name greater than 50 characters', function(done) {
        req.post('/cart/developer')
            .send({id: 1, name: "ASDASDASDASASDASDASDASASDASDASDASASDASDASDASASDASDASDASASDASDASDAS", price: 321.32})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 1);
                assert.equal(resp.body[0].param, 'name');
                assert.equal(resp.body[0].msg, 'name must has a maximum of 50 characters');
                done();
            });
    });

    it('adding developer to cart without price', function(done) {
        req.post('/cart/developer')
            .send({id:1, name: "test"})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 2);
                assert.equal(resp.body[0].param, 'price');
                assert.equal(resp.body[0].msg, 'price is required');
                assert.equal(resp.body[1].param, 'price');
                assert.equal(resp.body[1].msg, 'price must be a decimal value');
                done();
            });
    });

     it('adding developer to cart with price as non decimal', function(done) {
        req.post('/cart/developer')
            .send({id: 1, name: "test", price: "haha"})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 1);
                assert.equal(resp.body[0].param, 'price');
                assert.equal(resp.body[0].msg, 'price must be a decimal value');
                done();
            });
    });

    it('adding developer to cart without id', function(done) {
        req.post('/cart/developer')
            .send({name: "test", price: 200})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 2);
                assert.equal(resp.body[0].param, 'id');
                assert.equal(resp.body[0].msg, 'id is required');
                assert.equal(resp.body[1].param, 'id');
                assert.equal(resp.body[1].msg, 'id must be a integer value');
                done();
            });
    });

    it('adding developer to cart with id as non integer', function(done) {
        req.post('/cart/developer')
            .send({id: "2ds", name: "test", price: 200})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 1);
                assert.equal(resp.body[0].param, 'id');
                assert.equal(resp.body[0].msg, 'id must be a integer value');
                done();
            });
    });

    it('adding developer to cart without id, name and price', function(done) {
        req.post('/cart/developer')
            .send({id: "", name: "", price: ""})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 5);
                assert.equal(resp.body[0].param, 'id');
                assert.equal(resp.body[0].msg, 'id is required');
                assert.equal(resp.body[1].param, 'id');
                assert.equal(resp.body[1].msg, 'id must be a integer value');
                assert.equal(resp.body[2].param, 'name');
                assert.equal(resp.body[2].msg, 'name is required');
                assert.equal(resp.body[3].param, 'price');
                assert.equal(resp.body[3].msg, 'price is required');
                assert.equal(resp.body[4].param, 'price');
                assert.equal(resp.body[4].msg, 'price must be a decimal value');
                
                done();
            });
    });

    it('adding developer to cart with correct infos', function(done) {
        req.post('/cart/developer')
            .send({id: 1, name: "test", price: 200.57})
            .expect(201)
            .end(function(err, resp) {
                if (err) console.log(err);
                
                assert.equal(resp.body.id, 1);
                assert.equal(resp.body.name, 'test');
                assert.equal(resp.body.price, 200.57);
                done();
            });
    });

    it('adding duplicate developer to cart', function(done) {
        req.post('/cart/developer')
            .send({id: 1, name: "test", price: 200.57})
            .end(function(err, resp) {
                if (err) console.log(err);
                
                req.post('/cart/developer')
                    .send({id: 1, name: "test", price: 200.57})
                    .expect(400)
                    .end(function(err, resp) {
                        assert.equal(resp.body.length, 1);
                        assert.equal(resp.body[0].param, 'id');
                        assert.equal(resp.body[0].msg, 'developer is already in cart');
                        done();
                    });
            });
    });

    it('removing developer from cart with non int id', function(done) {
        req.delete('/cart/developer/' + "2e2d")
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;

                assert.equal(resp.body.length, 1);
                assert.equal(resp.body[0].param, 'id');
                assert.equal(resp.body[0].msg, 'id is required and must be a integer value');
                done();
            });
    });

    it('removing developer from cart', function(done) {
        req.post('/cart/developer')
            .send({name:"test", price: 200.57})
            .end(function(err, resp) {
                if (err) throw err;

                req.delete('/cart/developer/' + 1)
                    .expect(200, done);
            });
    });

    it('getting developers from empty cart', function(done) {
        req.get('/cart/developers')
            .expect(200)
            .end(function(err, resp) {
                if (err) throw err;

                assert.equal(resp.body.length, 0);
                done();
            });
    });

    it('getting developers from populated cart', function(done) {
        req.post('/cart/developer')
            .send({id: 1, name: "test", price: 200.57})
            .end(function(err, resp) {
                if (err) throw err;

                req.post('/cart/developer')
                    .send({id: 2, name: "test2", price: 202.57})
                    .end(function(err2, resp2) {
                        if (err2) throw err2;
                        
                        req.get('/cart/developers')
                            .expect(200)
                            .end(function(err3, resp3) {
                                if (err3) throw err3;

                                assert.equal(resp3.body.length, 2);
                                done();
                            });
                    });
            });
    });
});