/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');

let app = express();
let server = require('http').Server(app);

//config
let config = require('../config/config.json');
let router = require('../routes/_index')();

//middlewares
let midTrimmer = require('../middleware/trimmer');

app.use(cookieParser());
app.use(session({secret: config.app.key}));

//web config
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, '../public/img/icon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//adding middlewares
app.use(midTrimmer);
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.baseUrl = config.app.baseUrl;

    if (err.name == 'IpDeniedError') {
        res.status(403);
        err.stack = null;
        res.locals.error = err;
    } else {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = config.app.env === 'dev' ? err : {};

        // render the error page
        res.status(err.status || 500);
    }

    res.render('error');
});

//module.exports = app;
module.exports = {app: app, server: server};