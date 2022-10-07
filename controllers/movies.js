const Movie = require('../models/movie'); // экспортироали модель карточки
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovie = (req, res, next) => Movie.find({})
  .then((cards) => res.send(cards))
  .catch(next);

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((movie) => {
      if (movie) {
        if (String(movie.owner) !== req.user._id) {
          movie.remove(req.params._id)
            .then(() => res.send({ message: 'Карточка успешно удалена!' }));
        } else {
          next(new ForbiddenError('Удаление чужой карточки недоступно'));
        }
      } else {
        next(new NotFoundError('Фильм не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovie,
  createMovies,
  deleteMovie,
};