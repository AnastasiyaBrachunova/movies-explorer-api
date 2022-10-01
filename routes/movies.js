const router = require('express').Router();

const {
  // likeCard,
  // dislikeCard,
  getMovie,
  createMovies,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateСreateCards,
  validateGetCardId,
} = require('../errors/validatorJoi');

router.get('/movies', getMovie); // возвращает все фильмы
router.post('/movies', validateСreateCards, createMovies); // создает карточку фильмв
router.delete('/movies/_id', validateGetCardId, deleteMovie); // удаляеn фильм по айди
// router.put('/cards/:cardId/likes', validateGetCardId, likeCard); // лайк карточки
// router.delete('/cards/:cardId/likes', validateGetCardId, dislikeCard); // дизлайк карточки

module.exports = router;
