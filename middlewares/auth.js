const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) next(new AuthError('Отсутствует токен'));

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'movies-explorer');
  } catch (err) {
    const authError = new AuthError('Отсутствует токен');
    next(authError);
  }

  req.user = payload;
  console.log(req.user);

  next();
};
