var express = require('../config/custom-express')();
var req = require('supertest')(express);
var assert = require('assert');

describe('DevelopersController', function() {
    beforeEach(function(done) {
        var conn = express.persistence.connectionFactory();
        conn.query("TRUNCATE TABLE developers", function(err, result) {
            if(!err) done();
        });
    });

    it('list of developers in json format', function(done) {
        this.timeout(4000);

        req.get('/developers')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('adding developer withou name', function(done) {
        req.post('/developers/developer')
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

    it('adding developer with name greater than 50 characters', function(done) {
        req.post('/developers/developer')
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

    it('adding developer without price', function(done) {
        req.post('/developers/developer')
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

     it('adding developer with price as non decimal', function(done) {
        req.post('/developers/developer')
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

    it('adding developer without name and price', function(done) {
        req.post('/developers/developer')
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

    it('adding developer with correct infos', function(done) {
        req.post('/developers/developer')
            .send({name:"test", price: 200.57})
            .expect(200)
            .end(function(err, resp) {
                if (err) throw err;
                
                assert.equal(resp.body.name, 'test');
                assert.equal(resp.body.price, 200.57);
                done();
            });
    });

    it('removing developer with non int id', function(done) {
        req.delete('/developers/developer/' + "2e2d")
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
        req.post('/developers/developer')
            .send({name:"test", price: 200.57})
            .expect(200, done);

        req.delete('/developers/developer/' + 1)
            .expect(200, done);
    });
});