const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found-err');
const AccessError = require('../errors/access-err');
const WrongDataError = require('../errors/wrong-data-err');

module.exports.getAllSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const { _id: owner } = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.find({ movieId: req.params.id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемый фильм не найдена');
      }
      if (!movie.owner === req.user._id) {
        throw new AccessError('Вы не являетесь хозяином фильма');
      }
      Movie.findOneAndDelete({ movieId: req.params.id })
        .then((movie) => {
          res.send(movie);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
