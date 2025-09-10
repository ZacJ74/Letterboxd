const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');


// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/users/auth');
    }
}


// -------------------------------- RESTful Routes for Movies --------------------------------

// Index Route: GET /movies
router.get('/', isLoggedIn, moviesController.getDashboard);


// New Route: GET /movies/new
router.get('/new', isLoggedIn, moviesController.newMovieForm);


// Create Route: POST /movies
router.post('/', isLoggedIn, moviesController.createMovie);


// Show Route: GET /movies/:id
router.get('/:id', isLoggedIn, moviesController.getMovie);


// Edit Route: GET /movies/:id/edit
router.get('/:id/edit', isLoggedIn, moviesController.editMovieForm);


// Update Route: PUT /movies/:id
router.put('/:id', isLoggedIn, moviesController.updateMovie);


// Delete Route: DELETE /movies/:id
router.delete('/:id', isLoggedIn, moviesController.deleteMovie);


module.exports = router;
