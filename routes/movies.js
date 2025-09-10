const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');

// --- CREATE (New) ---
// Form to add a new movie
router.get('/new', moviesController.newMovieForm);

// Create a new movie
router.post('/', moviesController.createMovie);

// --- READ (Show) ---
// A single movie by its ID
router.get('/:id', moviesController.getMovie);

// --- UPDATE ---
// Form to edit an existing movie
router.get('/:id/edit', moviesController.editMovieForm);

// Update an existing movie
router.put('/:id', moviesController.updateMovie);

// --- DELETE ---
// Delete a movie
router.delete('/:id', moviesController.deleteMovie);

module.exports = router;
