const { celebrate, Joi } = require('celebrate'); // ВАЛИДИРУЕМ ТОЛЬКО ТО, ЧТО ПОЛУЧАЕМ ОТ ПОЛЬЗОВАТЕЛЯ
const validator = require('validator');

const validateCreateUser = celebrate({ // signup
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateChangeUserInfo = celebrate({ // смена инфы
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
});

const validateLogin = celebrate({ // signin
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateGetMovieId = celebrate({ // получить по айди карточку для 3 роутов
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

const validateСreateMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string()
      .required(),
    director: Joi.string()
      .required(),
    duration: Joi.number()
      .required(),
    year: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    movieId: Joi.number()
      .required(),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
    image: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Неправильный формат ссылки постера');
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Неправильный формат ссылки трейлера');
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Неправильный формат ссылки постера');
      }),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateChangeUserInfo,
  validateСreateMovies,
  validateGetMovieId,
};
