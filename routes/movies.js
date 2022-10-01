const router = require('express').Router();

const {
  getMovie,
  createMovies,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateСreateMovies,
  validateGetMovieId,
} = require('../errors/validatorJoi');

router.get('/movies', getMovie); // возвращает все фильмы
router.post('/movies', validateСreateMovies, createMovies); // создает карточку фильмв
router.delete('/movies/_id', validateGetMovieId, deleteMovie); // удаляеn фильм по айди

module.exports = router;
