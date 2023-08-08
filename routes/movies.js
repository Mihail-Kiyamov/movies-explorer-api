const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getAllSavedMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const linkRegex = /https?:\/\/(www\.)?[0-9a-zA-Z.\-_~:/?#[\]@!$&'()*+,;=]+\.[0-9a-zA-Z.\-_~:/?#[\]@!$&'()*+,;=]+#?$/;
const idRegex = /^[0-9a-z]{24}$/;

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
  }),
}), createMovie);
router.delete('/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().regex(idRegex).length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
