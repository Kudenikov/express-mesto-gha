const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const Forbidden = require('../errors/Forbidden');
const { JWT_SECRET } = require('../config/index');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Forbidden('Нет прав'));
  }
  req.user = payload;
  next();
};
