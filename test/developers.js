var express = require('../config/custom-express')();
var req = require('supertest')(express);
var assert = require('assert');

describe('DevelopersController', function() {
    it('list of developers in json format', function(done) {
        this.timeout(100000);

        req.get('/developers')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});