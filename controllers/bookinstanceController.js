const BookInstance = require('../models/bookinstance');
const {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');

const Book = require('../models/book');


exports.bookinstance_list = function(req, res, next) {
  BookInstance.find().populate('book')
      .exec(function(err, list_bookinstances) {
        if (err) {
          return next(err);
        }
        res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
      });
};


exports.bookinstance_detail = function(req, res, next) {
  BookInstance.findById(req.params.id).populate('book')
      .exec(function(err, results) {
        if (err) {
          return next(err);
        }
        if (results == null) {
          const err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
        res.render('bookinstance_detail', {title: 'Copy'+ results.book.title, bookinstance: results});
      });
};


exports.bookinstance_create_get = function(req, res, next) {
  Book.find({}, 'title')
      .exec(function(err, books) {
        if (err) {
          return next(err);
        }
        res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
      });
};


exports.bookinstance_create_post = [
  body('book', 'Book must be specified').isLength({min: 1}).trim(),
  body('imprint', 'Imprint must be specified').isLength({min: 1}).trim(),
  body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      Book.find({}, 'title').exec(function(err, books) {
        if (err) {
          return next(err);
        }
        res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance});
      });
      return;
    } else {
      bookinstance.save(function(err) {
        bookinstance.save(function(err) {
          if (err) {
            return next(err);
          }
          res.redirect(bookinstance.url);
        });
      });
    }
  },

];

exports.bookinstance_delete_get = function(req, res, next) {
  BookInstance.findById(req.params.id).exec(function(err, results) {
    if (err) {
      return next(err);
    }
    if (results == null) {
      res.redirect('/catalog/books');
    }
    res.render('bookinstance_delete', {title: 'Delete BookInstance', bookinstance: results});
  });
};

exports.bookinstance_delete_post = function(req, res, next) {
  BookInstance.findById(req.body.bookinstanceid).exec(function(err, results) {
    if (err) {
      return next(err);
    }
    BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/catalog/bookinstances');
    });
  });
};

exports.bookinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

exports.bookinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};

