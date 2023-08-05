const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: function valid(value) {
        return validator.isURL(value);
      },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: function valid(value) {
        return validator.isURL(value);
      },
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function valid(value) {
        return validator.isURL(value);
      },
    },
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
