/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var register = require('./routes/register');
var fireRoute = require('./routes/fire');
var http = require('http');
var https = require('https');
var path = require('path');
var sass = require('node-sass');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

app.use(
        sass.middleware({
            src: __dirname + '/public', //where the sass files are 
            dest: __dirname + '/public', //where css should go
            debug: true // obvious
        })
       );

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
    app.locals.pretty = true;
}

app.get('/', routes.index);
app.get('/profile', routes.profile);
app.get('/fire', fireRoute.page);
app.get('/register', register.create);
app.get('/login', register.login);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
