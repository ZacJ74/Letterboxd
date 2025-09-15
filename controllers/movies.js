const Movie = require('../models/Movie');

// --- Dashboard: shows only logged-in user’s movies ---
exports.getDashboard = async (req, res) => {
  if (!req.session.userId) return res.redirect('/users/auth?mode=login');

  try {
    const movies = await Movie.find({ owner: req.session.userId }).sort({ createdAt: -1 });
    res.render('dashboard', { movies, userId: req.session.userId, message: null });
  } catch (err) {
    console.error('Error fetching dashboard movies:', err);
    res.status(500).send('Server error loading dashboard.');
  }
};

// --- Community: shows all movies ---

exports.getCommunity = async (req, res) => {
  if (!req.session.userId) return res.redirect('/users/auth?mode=login');

  try {
    // Fetch all movies, populate owner username
    const movies = await Movie.find({})
      .populate('owner', 'username')
      .sort({ createdAt: -1 });

    // Group movies by owner
    const moviesByUser = {};
    movies.forEach(movie => {
      const username = movie.owner.username;
      if (!moviesByUser[username]) moviesByUser[username] = [];
      moviesByUser[username].push(movie);
    });

    res.render('movies/community', { moviesByUser, userId: req.session.userId });
  } catch (err) {
    console.error('Error fetching community movies:', err);
    res.status(500).send('Server error loading community page.');
  }
};


// --- Show New Movie Form ---
exports.showNewForm = (req, res) => {
  res.render('movies/new');
};


// --- Create Movie ---
exports.createMovie = async (req, res) => {
  const { title, year, rating, imageUrl } = req.body;  // include imageUrl here
  try {
    await Movie.create({ 
      title, 
      year, 
      rating, 
      owner: req.session.userId,
      imageUrl // matches model + form field
    });
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
    res.render('movies/show', { movie, userId: req.session.userId });
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

    // Ownership check
    if (movie.owner.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }

    res.render('movies/edit', { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching movie for edit.');
  }
};

// --- Update Movie ---

exports.updateMovie = async (req, res) => {
  const { title, year, rating, imageUrl } = req.body;
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');

    // Ownership check
    if (movie.owner.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }

    await Movie.findByIdAndUpdate(req.params.id, { title, year, rating, imageUrl });

    // ✅ Redirect to dashboard after update
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating movie.');
  }
};



// --- Delete Movie ---
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');

    // Ownership check
    if (movie.owner.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting movie.');
  }
};



