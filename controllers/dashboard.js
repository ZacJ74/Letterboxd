// controllers/moviesController.js
const Movie = require('../models/Movie');

// Show dashboard with all movies for the logged-in user

exports.getDashboard = async (req, res) => {
  try {
    // Find all movies belonging to the logged-in user
    const movies = await Movie.find({ user: req.session.userId });

    // Render the dashboard and pass the movies
    res.render('dashboard', { movies, userId: req.session.userId, message: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error fetching movies');
  }
};


// Show single movie (optional)
exports.showMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('movies/show', { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error fetching movie.');
  }
};

// Show form to add new movie
exports.newMovieForm = (req, res) => {
  res.render('movies/new');
};

// Handle new movie submission
exports.createMovie = async (req, res) => {
  try {
    const { title, year, rating } = req.body;
    const movie = new Movie({
      title,
      year,
      rating,
      user: req.session.userId
    });
    await movie.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error creating movie:', err);
    res.status(500).send('Server error creating movie.');
  }
};
