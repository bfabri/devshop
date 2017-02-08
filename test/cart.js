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
            .send({name:"", price:321.32})
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
            .send({name:"ASDASDASDASASDASDASDASASDASDASDASASDASDASDASASDASDASDASASDASDASDAS", price:321.32})
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
            .send({name:"test"})
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
            .send({name:"test", price: "haha"})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 1);
                assert.equal(resp.body[0].param, 'price');
                assert.equal(resp.body[0].msg, 'price must be a decimal value');
                done();
            });
    });

    it('adding developer to cart without name and price', function(done) {
        req.post('/cart/developer')
            .send({name:"", price: ""})
            .expect(400)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.length, 3);
                assert.equal(resp.body[0].param, 'name');
                assert.equal(resp.body[0].msg, 'name is required');
                assert.equal(resp.body[1].param, 'price');
                assert.equal(resp.body[1].msg, 'price is required');
                assert.equal(resp.body[2].param, 'price');
                assert.equal(resp.body[2].msg, 'price must be a decimal value');
                done();
            });
    });

    it('adding developer to cart with correct infos', function(done) {
        req.post('/cart/developer')
            .send({name:"test", price: 200.57})
            .expect(201)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.name, 'test');
                assert.equal(resp.body.price, 200.57);
                done();
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
            .expect(200);

        req.delete('/cart/developer/' + 1)
            .expect(200, done);
    });
});