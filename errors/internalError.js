const internalError = ((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка99999999' : message });
  next();
});

module.exports = internalError;
