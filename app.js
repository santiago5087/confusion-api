require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

const url = process.env.MONGO_URI;

mongoose.connect(url).then((db) => {
  console.log('Connected correctly to the server');
}, (err) => console.log(err));

const userRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
const feedbackRouter = require('./routes/feedbackRouter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/feedback', feedbackRouter);
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public/index.html'));
})

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