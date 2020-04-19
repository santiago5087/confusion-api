const express = require('express');
const promoRouter = express.Router();

const Promotion = require('../models/promotions');

promoRouter.route('/')
.get((req, res, next) => {
    Promotion.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch(err => next(err));
})
.post((req, res) => {
    Promotion.create(req.body)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res) => {
    Promotion.remove({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => next(err))
    .catch(err => next(err));
});

promoRouter.route('/:promoId')
.get((req, res) => {
    Promotion.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /promotions/" + req.params.promoId);
})
.put((req, res) => {
    Promotion.findByIdAndUpdate(req.params.promoId, {$set: req.body}, {new: true})
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res) => {
    Promotion.findByIdAndDelete(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;