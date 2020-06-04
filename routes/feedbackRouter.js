const express = require('express');
const feedbackRouter = express.Router();
var authenticate = require('../authenticate');
var cors = require('./cors');

const Feedback = require('../models/feedbacks');

feedbackRouter.options('*', cors.corsWithOptions, (req, res) => res.sendStatus(200));

feedbackRouter.post('/', cors.corsWithOptions, (req, res, next) => {
  Feedback.create(req.body)
  .then(feedback => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(feedback);
  }, err => next(err))
  .catch(err => next(err));
});

module.exports = feedbackRouter;