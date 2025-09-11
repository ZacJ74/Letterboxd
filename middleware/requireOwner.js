// middleware/requireOwner.js
const Movie = require('../models/Movie');

async function requireOwner(req, res, next) {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).render('404');
        }

        // Only allow the logged-in user to edit/delete their own movie
        if (movie.user.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Not authorized');
        }

        // Attach movie to request so controller doesn’t need to fetch again
        req.movie = movie;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

module.exports = requireOwner;
