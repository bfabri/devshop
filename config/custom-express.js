var express = require('express');
var consign = require('consign');

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function() {
    var app = express();

    app.use(express.static('public'));

    app.set('view engine', 'ejs');
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    consign().include('controllers').then('persistence').then('services').into(app);

    return app;
}