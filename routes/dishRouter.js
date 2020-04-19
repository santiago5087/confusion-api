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

dishRouter.route('/:dishId/comments')
.get((req, res) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {

        if (dish) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments);
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if (dish) {
            dish.comments.push(req.body);
            
            dish.save()
            .then((result) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes/" + req.params.dishId + "/comments")
})
.delete((req, res) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {

        if (dish) {
        
        for (var i=0; i < dish.comments.length; i++) {
            dish.comments.id(dis.comments[i]._id).remove();
        }

        dish.save()
        .then((result) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        }, (err) => next(err));
        
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            var comment = dish.comments.id(req.params.commentId);
            if (req.body.rating) {
                comment.rating = req.body.rating;
            }
            if (req.body.comment) {
                comment.comment = req.body.comment;
            }
            
            dish.save()
            .then((result) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove()

            dish.save()
            .then((result) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err)); 
});

module.exports = dishRouter;