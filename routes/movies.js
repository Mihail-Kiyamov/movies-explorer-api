const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllSavedMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const linkRegex = /https?:\/\/(www\.)?[0-9a-z.\-_~:/?#[\]@!$&'()*+,;=]+\.[0-9a-z.\-_~:/?#[\]@!$&'()*+,;=]+#?$/;

router.get('/', getAllSavedMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(linkRegex).required(),
    trailerLink: Joi.string().regex(linkRegex).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().regex(linkRegex).required(),
    movieId: Joi.number().required(),
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().regex(linkRegex).required(),
  }),
}), createMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
