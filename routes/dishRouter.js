const express = require('express');
const dishRouter = express.Router();

const Dish = require('../models/dishes');

dishRouter.route('/')
.get((req, res) => {
    Dish.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res) => {
    Dish.create(req.body)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes")
})
.delete((req, res) => {
    Dish.remove({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.put((req, res, next) => {
  Dish.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})
  .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dish.findByIdAndRemove(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => console.log(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;