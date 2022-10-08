const Movie = require('../models/movie'); // экспортироали модель карточки
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const message = require('../utils/constant');

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
        next(new BadRequest(message.BAD_REQUEST_ERROR));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError(message.NOT_FOUND_ERROR);
    })
    .then((movie) => {
      if (movie) {
        if (String(movie.owner) !== req.user._id) {
          return movie.remove(req.params._id)
            .then(() => res.send(message.OK))
            .catch((err) => next(err));
        }
        throw new ForbiddenError(message.FORBIDDEN_ERROR);
      } else {
        return next(new NotFoundError(message.NOT_FOUND_ERROR));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(message.BAD_REQUEST_ERROR));
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
