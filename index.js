var express = require('express');
var minify = require('express-minify');
var version = require('./version.js');
var app = express();

app.set('port', (process.env.PORT || 5000));

if (app.get('env') != 'development') {
	app.use(minify({cache: __dirname + '/cache'}));
}
app.use(express.static(__dirname + '/public'));
app.use(version);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/main');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


