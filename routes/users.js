var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var User = require('../models/users');

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200) });

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
})

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  var user = new User({username: req.body.username});
  if (req.body.firstname) {
    user.firstname = req.body.firstname;
  }
  if (req.body.lastname) {
    user.lastname = req.body.lastname;
  }
  User.register(user, req.body.password, (err, userR) => {
    if (err) {
      err.status = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    } else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { //Para devolver algo más detallado que un "unauthorized"
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }

    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user !'});
      }

      console.log(req.user);
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token});
      
    });

  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, username: req.user.username, status: "You are successfully logged in!"});
  }
});

router.get('/auth/facebook', cors.corsWithOptions,
  passport.authenticate('facebook', {scope: ['public_profile, email']}));

router.get('/auth/facebook/callback', cors.corsWithOptions, passport.authenticate('facebook'),
  function(req, res) {
    var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "http://localhost:4200");window.close();</script></html>';

    var token = authenticate.getToken({_id: req.user._id});

    responseHTML = responseHTML.replace('%value%', JSON.stringify({
      success: true,  
      token: token,
      username: req.user.username,
      status: "You are successfully logged in!"
    }));
    res.status(200).send(responseHTML);
});

router.get('/auth/google', cors.corsWithOptions,
  passport.authenticate('google', {scope: ['profile', 'email']} ));

router.get('/auth/google/callback', cors.corsWithOptions, passport.authenticate('google'), 
  function(req, res) {
    var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "http://localhost:4200");window.close();</script></html>';

    var token = authenticate.getToken({_id: req.user._id});

    responseHTML = responseHTML.replace('%value%', JSON.stringify({
      success: true,  
      token: token,
      username: req.user.username,
      status: "You are successfully logged in!"
    }));
    res.status(200).send(responseHTML);
});

router.get('/checkJWTToken', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});
    }
  })(req, res, next);
});


module.exports = router;