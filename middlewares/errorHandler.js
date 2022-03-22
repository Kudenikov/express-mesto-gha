module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ err: message || 'Произошла ошибка на сервере' });
  return next();
};
