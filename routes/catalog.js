const express = require('express');
const router = express.Router();

const book_contoller = require('../controllers/bookController');
const author_contoller = require('../controllers/authorController');
const genre_contoller = require('../controllers/genreController');
const book_instance_contoller = require('../controllers/bookinstanceController');


// book
router.get('/', book_contoller.index);

router.get('/book/create', book_contoller.book_create_get);
router.post('/book/create', book_contoller.book_create_post);

router.get('/book/:id/delete', book_contoller.book_delete_get);
router.post('/book/:id/delete', book_contoller.book_delete_post);

router.get('/book/:id/update', book_contoller.book_update_get);
router.post('/book/:id/update', book_contoller.book_update_post);

router.get('/book/:id', book_contoller.book_detail);
router.get('/books', book_contoller.book_list);


// author routes
router.get('/author/create', author_contoller.author_create_get);
router.post('/author/create', author_contoller.author_create_post);

router.get('/author/:id/delete', author_contoller.author_delete_get);
router.post('/author/:id/delete', author_contoller.author_delete_post);

router.get('/author/:id/update', author_contoller.author_update_get);
router.post('/author/:id/update', author_contoller.author_update_post);

router.get('/author/:id', author_contoller.author_detail);
router.get('/authors', author_contoller.author_list);


// genre routes
router.get('/genre/create', genre_contoller.genre_create_get);
router.post('/genre/create', genre_contoller.genre_create_post);

router.get('/genre/:id/delete', genre_contoller.genre_delete_get);
router.post('/genre/:id/delete', genre_contoller.genre_delete_post);

router.get('/genre/:id/update', genre_contoller.genre_update_get);
router.post('/genre/:id/update', genre_contoller.genre_update_post);

router.get('/genre/:id', genre_contoller.genre_detail);
router.get('/genres', genre_contoller.genre_list);


// bookinstance routes
router.get('/bookinstance/create', book_instance_contoller.bookinstance_create_get);
router.post('/bookinstance/create', book_instance_contoller.bookinstance_create_post);

router.get('/bookinstance/:id/delete', book_instance_contoller.bookinstance_delete_get);
router.post('/bookinstance/:id/delete', book_instance_contoller.bookinstance_delete_post);

router.get('/bookinstance/:id/update', book_instance_contoller.bookinstance_update_get);
router.post('/bookinstance/:id/update', book_instance_contoller.bookinstance_update_post);

router.get('/bookinstance/:id', book_instance_contoller.bookinstance_detail);
router.get('/bookinstances', book_instance_contoller.bookinstance_list);

module.exports = router;
