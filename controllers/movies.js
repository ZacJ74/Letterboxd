



const Movie = require('../models/Movie');
const User = require('../models/User');

// --- READ (Index) ---
// Gets all movies for the logged-in user and renders the dashboard page.
exports.getDashboard = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/users/auth');
        }
        const user = await User.findById(req.session.userId);
        const movies = await Movie.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.render('dashboard', { user, movies, message: req.query.message });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('An error occurred.');
    }
};

// --- CREATE (New) ---
// Renders the form to add a new movie.
exports.newMovieForm = (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/users/auth');
    }
    res.render('new-movie', { error: null });
};

// --- CREATE (Post) ---
// Handles the submission of the new movie form.
exports.createMovie = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).send('Unauthorized');
        }
        const { title, year, review, rating, imageUrl } = req.body;
        const newMovie = new Movie({
            title,
            year,
            review,
            rating,
            imageUrl: imageUrl || 'https://placehold.co/400x600/a0aec0/2d3748?text=No+Image',
            user: req.session.userId
        });
        await newMovie.save();
        res.redirect('/'); // ✅ changed from /movies
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).send('An error occurred.');
    }
};

// --- READ (Show) ---
// Gets a single movie by its ID and renders the details page.
exports.getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('user');
        if (!movie) {
            return res.status(404).send('Movie not found.');
        }

        const isOwner = req.session.userId && movie.user && movie.user._id.equals(req.session.userId);

        res.render('movie-details', { movie, isOwner });
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).send('An error occurred.');
    }
};

// --- UPDATE (Edit) ---
// Renders the form to edit an existing movie.
exports.editMovieForm = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found.');
        }
        if (!movie.user.equals(req.session.userId)) {
            return res.status(403).send('Forbidden.');
        }
        res.render('edit-movie', { movie });
    } catch (error) {
        console.error('Error fetching movie for edit:', error);
        res.status(500).send('An error occurred.');
    }
};

// --- UPDATE (Put) ---
// Handles the submission of the edit form.
exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found.');
        }
        if (!movie.user.equals(req.session.userId)) {
            return res.status(403).send('Forbidden.');
        }
        await movie.updateOne(req.body);
        res.redirect(`/movies/${movie._id}`);
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).send('An error occurred.');
    }
};

// --- DELETE ---
// Handles the deletion of a movie.
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found.');
        }
        if (!movie.user.equals(req.session.userId)) {
            return res.status(403).send('Forbidden.');
        }
        await movie.deleteOne();
        res.redirect('/?message=Movie successfully deleted!'); // changed from /movies
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send('An error occurred.');
    }
};






// const mongoose = require('mongoose');
// const Movie = require('../models/Movie');
// const User = require('../models/User');

// // --- READ (Index) ---
// // Gets all movies for the logged-in user and renders the dashboard page.
// exports.getDashboard = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.redirect('/users/auth');
//         }
//         const user = await User.findById(req.session.userId);
//         const movies = await Movie.find({ user: req.session.userId }).sort({ createdAt: -1 });
//         res.render('dashboard', { user, movies, message: req.query.message });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- CREATE (New) ---
// // Renders the form to add a new movie.
// exports.newMovieForm = (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/users/auth');
//     }
//     res.render('new-movie', { error: null });
// };

// // --- CREATE (Post) ---
// // Handles the submission of the new movie form.
// exports.createMovie = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.status(401).send('Unauthorized');
//         }
//         const { title, year, review, rating, imageUrl } = req.body;
//         const newMovie = new Movie({
//             title,
//             year,
//             review,
//             rating,
//             imageUrl: imageUrl || 'https://placehold.co/400x600/a0aec0/2d3748?text=No+Image',
//             user: req.session.userId
//         });
//         await newMovie.save();
//         res.redirect('/movies');
//     } catch (error) {
//         console.error('Error creating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- READ (Show) ---
// // Gets a single movie by its ID and renders the details page.
// exports.getMovie = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send('Invalid movie ID.');
//         }

//         const movie = await Movie.findById(id).populate('user');
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check: only show if the user is the owner
//         const isOwner = req.session.userId && movie.user && movie.user._id.equals(req.session.userId);

//         res.render('movie-details', { movie, isOwner });
//     } catch (error) {
//         console.error('Error fetching movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Edit) ---
// // Renders the form to edit an existing movie.
// exports.editMovieForm = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send('Invalid movie ID.');
//         }

//         const movie = await Movie.findById(id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }

//         res.render('edit-movie', { movie });
//     } catch (error) {
//         console.error('Error fetching movie for edit:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Put) ---
// // Handles the submission of the edit form.
// exports.updateMovie = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send('Invalid movie ID.');
//         }

//         const movie = await Movie.findById(id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }

//         await movie.updateOne(req.body);
//         res.redirect(`/movies/${movie._id}`);
//     } catch (error) {
//         console.error('Error updating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- DELETE ---
// // Handles the deletion of a movie.
// exports.deleteMovie = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send('Invalid movie ID.');
//         }

//         const movie = await Movie.findById(id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }

//         await movie.deleteOne();
//         res.redirect('/movies?message=Movie successfully deleted!');
//     } catch (error) {
//         console.error('Error deleting movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };












// const Movie = require('../models/Movie');
// const User = require('../models/User');

// // --- READ (Index) ---
// // Gets all movies for the logged-in user and renders the dashboard page.
// exports.getDashboard = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.redirect('/users/auth');
//         }
//         const user = await User.findById(req.session.userId);
//         const movies = await Movie.find({ user: req.session.userId }).sort({ createdAt: -1 });
//         res.render('dashboard', { user, movies, message: req.query.message });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- CREATE (New) ---
// // Renders the form to add a new movie.
// exports.newMovieForm = (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/users/auth');
//     }
//     // FIX: Pass the 'error' variable to the view to prevent a ReferenceError.
//     res.render('new-movie', { error: null });
// };

// // --- CREATE (Post) ---
// // Handles the submission of the new movie form.
// exports.createMovie = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.status(401).send('Unauthorized');
//         }
//         const { title, year, review, rating, imageUrl } = req.body;
//         const newMovie = new Movie({
//             title,
//             year,
//             review,
//             rating,
//             imageUrl: imageUrl || 'https://placehold.co/400x600/a0aec0/2d3748?text=No+Image',
//             user: req.session.userId
//         });
//         await newMovie.save();
//         res.redirect('/movies');
//     } catch (error) {
//         console.error('Error creating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- READ (Show) ---
// // Gets a single movie by its ID and renders the details page.
// exports.getMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id).populate('user');
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check: only show if the user is the owner
//         const isOwner = req.session.userId && movie.user && movie.user._id.equals(req.session.userId);

//         res.render('movie-details', { movie, isOwner });
//     } catch (error) {
//         console.error('Error fetching movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Edit) ---
// // Renders the form to edit an existing movie.
// exports.editMovieForm = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can edit
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         res.render('edit-movie', { movie });
//     } catch (error) {
//         console.error('Error fetching movie for edit:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Put) ---
// // Handles the submission of the edit form.
// exports.updateMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can update
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.updateOne(req.body);
//         res.redirect(`/movies/${movie._id}`);
//     } catch (error) {
//         console.error('Error updating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- DELETE ---
// // Handles the deletion of a movie.
// exports.deleteMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can delete
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.deleteOne();
//         res.redirect('/movies?message=Movie successfully deleted!');
//     } catch (error) {
//         console.error('Error deleting movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };




// const Movie = require('../models/Movie');
// const User = require('../models/User');

// // --- READ (Index) ---
// // Gets all movies for the logged-in user and renders the dashboard page.
// exports.getDashboard = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.redirect('/users/auth');
//         }
//         const user = await User.findById(req.session.userId);
//         const movies = await Movie.find({ user: req.session.userId }).sort({ createdAt: -1 });
//         res.render('dashboard', { user, movies, message: req.query.message });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- CREATE (New) ---
// // Renders the form to add a new movie.
// exports.newMovieForm = (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/users/auth');
//     }
//     // FIX: Pass the 'error' variable to the view to prevent a ReferenceError.
//     res.render('new-movie', { error: null });
// };

// // --- CREATE (Post) ---
// // Handles the submission of the new movie form.
// exports.createMovie = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.status(401).send('Unauthorized');
//         }
//         const { title, year, review, rating, imageUrl } = req.body;
//         const newMovie = new Movie({
//             title,
//             year,
//             review,
//             rating,
//             imageUrl: imageUrl || 'https://placehold.co/400x600/a0aec0/2d3748?text=No+Image',
//             user: req.session.userId
//         });
//         await newMovie.save();
//         res.redirect('/movies');
//     } catch (error) {
//         console.error('Error creating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- READ (Show) ---
// // Gets a single movie by its ID and renders the details page.
// exports.getMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id).populate('user');
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check: only show if the user is the owner
//         const isOwner = req.session.userId && movie.user && movie.user._id.equals(req.session.userId);

//         res.render('movie-details', { movie, isOwner });
//     } catch (error) {
//         console.error('Error fetching movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Edit) ---
// // Renders the form to edit an existing movie.
// exports.editMovieForm = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can edit
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         res.render('edit-movie', { movie });
//     } catch (error) {
//         console.error('Error fetching movie for edit:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Put) ---
// // Handles the submission of the edit form.
// exports.updateMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can update
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.updateOne(req.body);
//         res.redirect(`/movies/${movie._id}`);
//     } catch (error) {
//         console.error('Error updating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- DELETE ---
// // Handles the deletion of a movie.
// exports.deleteMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can delete
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.deleteOne();
//         res.redirect('/movies?message=Movie successfully deleted!');
//     } catch (error) {
//         console.error('Error deleting movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };











// const Movie = require('../models/Movie');
// const User = require('../models/User');

// // --- READ (Index) ---
// // Gets all movies for the logged-in user and renders the dashboard page.
// exports.getDashboard = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.redirect('/users/auth');
//         }
//         const user = await User.findById(req.session.userId);
//         const movies = await Movie.find({ user: req.session.userId }).sort({ createdAt: -1 });
//         res.render('dashboard', { user, movies, message: req.query.message });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- CREATE (New) ---
// // Renders the form to add a new movie.
// exports.newMovieForm = (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/users/auth');
//     }
//     // FIX: Pass the 'error' variable to the view to prevent a ReferenceError.
//     res.render('new-movie', { error: null });
// };

// // --- CREATE (Post) ---
// // Handles the submission of the new movie form.
// exports.createMovie = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.status(401).send('Unauthorized');
//         }
//         const { title, year, review, rating, imageUrl } = req.body;
//         const newMovie = new Movie({
//             title,
//             year,
//             review,
//             rating,
//             imageUrl: imageUrl || 'https://placehold.co/400x600/a0aec0/2d3748?text=No+Image',
//             user: req.session.userId
//         });
//         await newMovie.save();
//         res.redirect('/movies');
//     } catch (error) {
//         console.error('Error creating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- READ (Show) ---
// // Gets a single movie by its ID and renders the details page.
// exports.getMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id).populate('user');
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check: only show if the user is the owner
//         const isOwner = req.session.userId && movie.user && movie.user._id.equals(req.session.userId);

//         res.render('movie-details', { movie, isOwner });
//     } catch (error) {
//         console.error('Error fetching movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Edit) ---
// // Renders the form to edit an existing movie.
// exports.editMovieForm = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can edit
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         res.render('edit-movie', { movie });
//     } catch (error) {
//         console.error('Error fetching movie for edit:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Put) ---
// // Handles the submission of the edit form.
// exports.updateMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can update
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.updateOne(req.body);
//         res.redirect(`/movies/${movie._id}`);
//     } catch (error) {
//         console.error('Error updating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- DELETE ---
// // Handles the deletion of a movie.
// exports.deleteMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can delete
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.deleteOne();
//         res.redirect('/movies?message=Movie successfully deleted!');
//     } catch (error) {
//         console.error('Error deleting movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };





// const Movie = require('../models/Movie');
// const User = require('../models/User');

// // --- READ (Index) ---
// // Gets all movies for the logged-in user and renders the dashboard page.
// exports.getDashboard = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.redirect('/users/auth');
//         }
//         const user = await User.findById(req.session.userId);
//         const movies = await Movie.find({ user: req.session.userId }).sort({ createdAt: -1 });
//         res.render('dashboard', { user, movies, message: req.query.message });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- CREATE (New) ---
// // Renders the form to add a new movie.
// exports.newMovieForm = (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/users/auth');
//     }
//     res.render('new-movie');
// };

// // --- CREATE (Post) ---

// exports.createMovie = async (req, res) => {
//     try {
//         if (!req.session.userId) {
//             return res.status(401).send('Unauthorized');
//         }
//         const { title, year, review, rating, imageUrl } = req.body;
//         const newMovie = new Movie({
//             title,
//             year,
//             review,
//             rating,
//             imageUrl: imageUrl || 'https://placehold.co/400x600/a0aec0/2d3748?text=No+Image',
//             user: req.session.userId
//         });
//         await newMovie.save();
//         res.redirect('/movies');
//     } catch (error) {
//         console.error('Error creating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- READ (Show) ---
// // Gets a single movie by its ID and renders the details page.
// exports.getMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id).populate('user');
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }

//         // Authorization check: only show if the user is the owner
//         const isOwner = req.session.userId && movie.user && movie.user._id.equals(req.session.userId);

//         res.render('movie-details', { movie, isOwner });
//     } catch (error) {
//         console.error('Error fetching movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Edit) ---
// // Renders the form to edit an existing movie.
// exports.editMovieForm = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can edit
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         res.render('edit-movie', { movie });
//     } catch (error) {
//         console.error('Error fetching movie for edit:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- UPDATE (Put) ---
// // Handles the submission of the edit form.
// exports.updateMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can update
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.updateOne(req.body);
//         res.redirect(`/movies/${movie._id}`);
//     } catch (error) {
//         console.error('Error updating movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };

// // --- DELETE ---
// // Handles the deletion of a movie.
// exports.deleteMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).send('Movie not found.');
//         }
//         // Authorization check: only the owner can delete
//         if (!movie.user.equals(req.session.userId)) {
//             return res.status(403).send('Forbidden.');
//         }
//         await movie.deleteOne();
//         res.redirect('/movies?message=Movie successfully deleted!');
//     } catch (error) {
//         console.error('Error deleting movie:', error);
//         res.status(500).send('An error occurred.');
//     }
// };
