var app = require('./config/custom-express')();

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server is running using port ' + port);
});