const Movie = require('../models/Movie');

// --- Dashboard / List Movies ---
// --- Dashboard Controller ---
exports.getDashboard = async (req, res) => {
  try {
    if (!req.session.userId) {
      // If not logged in, redirect to login page
      return res.redirect('/users/auth?mode=login');
    }

    // Fetch movies belonging to the logged-in user
const movies = await Movie.find({ owner: req.session.userId }).sort({ createdAt: -1 });


    // Render the dashboard with the movies
    res.render('dashboard', { movies, userId: req.session.userId, message: null });
  } catch (err) {
    console.error('Error fetching dashboard movies:', err);
    res.status(500).send('Server error loading dashboard.');
  }
};

// --- Show New Movie Form ---
exports.showNewForm = (req, res) => {
  res.render('movies/new');
};

// --- Create Movie ---
exports.createMovie = async (req, res) => {
  const { title, year, rating } = req.body;
  try {
    await Movie.create({ title, year, rating, owner: req.session.userId });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating movie.');
  }
};

// --- Show Single Movie ---
exports.showMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('movies/show', { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching movie.');
  }
};

// --- Show Edit Form ---
exports.showEditForm = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('movies/edit', { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching movie for edit.');
  }
};

// --- Update Movie ---
exports.updateMovie = async (req, res) => {
  const { title, year, rating } = req.body;
  try {
    await Movie.findByIdAndUpdate(req.params.id, { title, year, rating });
    res.redirect(`/movies/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating movie.');
  }
};

// --- Delete Movie ---
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting movie.');
  }
};
