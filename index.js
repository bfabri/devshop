var app = require('./config/custom-express')();

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server is running using port ' + port);
});

app.get('/', function(req, resp) {
    var baseUrl = 'http://localhost:3000';
    if (process.env.NODE_ENV == 'production') {
        baseUrl = 'https://fabri-devshop.herokuapp.com/';
    }
    
    resp.render('app', {baseUrl: baseUrl});
})