const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-err');
const WrongDataError = require('../errors/wrong-data-err');
const DublicateError = require('../errors/dublicate-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'movies-explorer', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 604800000 }).send(user);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', 'none', {
    maxAge: 5000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  }).sendStatus(200).send('Вы вышли из аккаунта');
}

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError('Запрашиваемый пользователь не найден');
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DublicateError('Пользователь с такой почтой уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new DublicateError('Пользователь с такой почтой уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new WrongDataError('Некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
