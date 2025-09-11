const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number },
  rating: { type: Number, min: 0, max: 5 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // make sure it's `owner`
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
