const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const { isLoggedIn } = require('../middleware/auth');

// Dashboard / list movies
router.get('/', isLoggedIn, moviesController.getDashboard);
router.get('/community', isLoggedIn, moviesController.getCommunity);

// Show new movie form
router.get('/new', isLoggedIn, moviesController.showNewForm);

// Create movie
router.post('/', isLoggedIn, moviesController.createMovie);

// Show single movie (anyone can view)
router.get('/:id', moviesController.showMovie);

// Show edit form
router.get('/:id/edit', isLoggedIn, moviesController.showEditForm);

// Update movie
router.put('/:id', isLoggedIn, moviesController.updateMovie);

// Delete movie
router.delete('/:id', isLoggedIn, moviesController.deleteMovie);

module.exports = router;
