const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const requireLogin = require('../middleware/requireLogin');
const requireOwner = require('../middleware/requireOwner');

// CREATE new movie (auth required)
router.get('/new', requireLogin, moviesController.getNewMovieForm);
router.post('/', requireLogin, moviesController.createMovie);

// READ single movie (auth required)
router.get('/:id', requireLogin, moviesController.getMovieDetails);

// UPDATE (auth + ownership required)
router.get('/:id/edit', requireLogin, requireOwner, moviesController.getEditMovieForm);
router.put('/:id', requireLogin, requireOwner, moviesController.updateMovie);

// DELETE (auth + ownership required)
router.delete('/:id', requireLogin, requireOwner, moviesController.deleteMovie);

module.exports = router;
