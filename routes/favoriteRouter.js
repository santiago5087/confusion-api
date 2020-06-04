const express = require('express');
const favoriteRouter = express.Router();
var authenticate = require('../authenticate');
var cors = require('./cors');

var Dish = require('../models/dishes');
var Favorite = require('../models/favorites');
var User = require('../models/users');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id}, (err, favorite) => {
        if (err) return next(err);
        if (favorite) {
            req.body.forEach(e => {
                if (favorite.dishes.indexOf(e._id) == -1) {
                    favorite.dishes.push(e._id)
                }
            });
            
            favorite.save((err, fav) => {
                if (err) return next(err);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            });
        } else {
            var favorite = new Favorite({
                user: req.user._id,
                dishes: []
            });

            req.body.forEach(e => favorite.dishes.push(e._id));

            Favorite.create(favorite, (err, fav) => {
                if (err) return next(err);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            });
        }
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.deleteOne({user: req.user._id}, (err) => {
        if (err) return next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: "Your favorite list has been removed successfully!"});
    });
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({exist: false, favorites: favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) == -1) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({exist: false, favorites: favorites});
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({exist: true, favorites: favorites});
            }
        }
    }, (err) => next(er))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Dish.findById(req.params.dishId, (err, dish) => {
        if (err) return next(err);
        else if (dish) {
            Favorite.findOne({user: req.user._id}, (err, favorite) => {
                if (err) return next(err);
                if (favorite) {
                    if (favorite.dishes.indexOf(req.params.dishId) == -1) {
                        favorite.dishes.push(req.params.dishId);
                        favorite.save((err, fav) => {
                            if (err) return next(err);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        });
                    } else {
                        var err = new Error('You already have this dish in your favorite list!');
                        err.status = 403;
                        return next(err);
                    }
                } else {
                    var favorite = new Favorite({
                        user: req.user._id,
                        dishes: [req.params.dishId]
                    });
                    Favorite.create(favorite, (err, fav) => {
                        if (err) return next(err);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(fav);
                    });
                }
            });
        } else {
            var err = new Error('The entered dish id doesn\'t exist!');
            err.status = 404;
            return next(err);
        }
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id}, (err, favorite) => {
        if (err) return next(err);
        if (favorite && favorite.dishes.indexOf(req.params.dishId) != -1) {
            favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId), 1);
            favorite.save((err, fav) => {
                Favorite.findById(fav._id)
                .populate('dishes').then(favc => {
                    if (err) return next(err);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favc);
                    console.log(favc);
                })
            });
        }
        else if (favorite) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('User ' + req.user.username + ' doesn\'t have a favorite list');
            err.status = 404;
            return next(err);
        }
    })
});

module.exports = favoriteRouter;