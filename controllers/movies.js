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
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
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
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { cardId } = req.params;
  Movie.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        next(new ForbiddenError('Удаление чужой карточки недоступно'));
      } else {
        Movie.findByIdAndRemove(cardId)
        // eslint-disable-next-line no-shadow
          .then(() => {
            res.send({ message: 'Карточка успешно удалена' });
          }).catch(next);
      }
    }).catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovie,
  createMovies,
  deleteMovie,
};
