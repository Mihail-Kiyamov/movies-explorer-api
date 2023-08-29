require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');

const { login, logout, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, BDURL = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(BDURL, {
  origin: 'ttp://localhost:3000',
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  credentials: true,
}));

app.use(helmet());

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 50,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signout', logout);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Некорректный путь'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
