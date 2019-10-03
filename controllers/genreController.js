const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const validator = require('express-validator');
const {body, validationResult, sanitizeBody} = require('express-validator');

exports.genre_list = function(req, res, next) {
  Genre.find().sort([['name', 'ascending']])
      .exec(function(err, list_genres) {
        if (err) {
          return next(err);
        }
        res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
      });
};


exports.genre_detail = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id).exec(callback);
    },

    genre_books: function(callback) {
      Book.find({'genre': req.params.id}).exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.genre == null) {
      const err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
  });
};


exports.genre_create_get = function(req, res, next) {
  res.render('genre_form', {title: 'Create Genre'});
};


exports.genre_create_post = [
  validator.body('name', 'Genre name required').isLength({min: 1}).trim(),
  validator.sanitizeBody('name').escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);
    const genre = new Genre({name: req.body.name});

    if (!errors.isEmpty()) {
      res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    } else {
      Genre.findOne({'name': req.body.name})
          .exec( function(err, found_genre) {
            if (err) {
              return next(err);
            }
            if (found_genre) {
              res.redirect(found_genre.url);
            } else {
              genre.save(function(err) {
                if (err) {
                  return next(err);
                }
                res.redirect(genre.url);
              });
            }
          });
    }
  },
];

exports.genre_delete_get = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: function(callback) {
      Book.find({'genre': req.params.id}).exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.genre == null) {
      res.redirect('/catalog/genres');
    }
    res.render('genre_delete', {title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books});
  });
};

exports.genre_delete_post = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.body.genreid).exec(callback);
    },
    genre_books: function(callback) {
      Book.find({'genre': req.body.genreid}).exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.genre_books.length > 0) {
      res.render('genre_delete', {title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books});
      return;
    } else {
      Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/catalog/genres');
      });
    }
  });
};


exports.genre_update_get = function(req, res, next) {
  Genre.findById(req.params.id).exec(function(err, genre) {
    if (err) {
      return next(err);
    }
    res.render('genre_form', {title: 'Update Genre', genre: genre});
  });
};


exports.genre_update_post = [

  body('name', 'Genre must not be empty').isLength({min: 1}).trim(),
  sanitizeBody('name').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render('genre_form', {title: 'Update Genre', genre: genre});
      return;
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, thegenre) {
        if (err) {
          return next(err);
        }
        res.redirect(thegenre.url);
      });
    }
  },
];

