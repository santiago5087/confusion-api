var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/conFusion';

mongoose.connect(url).then((db) => {
  console.log('Connected correctly to the server');
}, (err) => console.log(err));

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req, res, next) {
  console.log(req.headers);

  var authHeader = req.headers.authorization;
  if (!authHeader) {
    var err = new Error('You aren\'t autheticated!');
    res.setHeader('WWWW-Authenticate', 'Basic');
    err.status = 401;   //Unauthorized
    return next(err);
  }

  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString()
  var user = auth.split(':')[0];
  var password = auth.split(':')[1];

  if (user == 'admin' && password == 'password') {
    next();
  } else {
    var err = new Error('You aren\'t autheticated!');
    res.setHeader('WWWW-Authenticate', 'Basic');
    err.status = 401;   //Unauthorized
    next(err);
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;