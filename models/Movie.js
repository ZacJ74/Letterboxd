const mongoose = require('mongoose');

// Define the Movie Schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    imageUrl: {
        type: String,
        default: 'https://placehold.co/400x600/a0aec0/2d3748?text=No+Image',
    },
    // The user field creates a one-to-many relationship.
    // Each movie entry belongs to a specific user.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the Movie model
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
