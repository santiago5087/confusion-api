var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var Comment = require('./models/comments').model;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
var FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(userId) {
    return jwt.sign(userId, config.secretKey, {expiresIn: '2h'});
}

var ops = {};
ops.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
ops.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(ops, (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    User.findById(jwt_payload.id)
    .then((user) => {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch((err) => done(err, false));
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        var err = new Error('You are not authrorized to perform this operation!.');
        err.status = 403;
        next(err);
    }
}

exports.verifyOwner = (req, res, next) => {    
    Comment.findById(req.params.commentId)
    .then((comment) => {
        if (req.user._id.equals(comment.author)) {
            next();
        } else {
            var err = new Error('You are not authorized to perform this operation!.');
            err.status = 403;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (!err && user) {
            return done(null, user);
        } else {
            user = new User({username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err) {
                    return done(err, false);
                } else {
                    return done(null, user);
                }
            });
        }
    });
}));