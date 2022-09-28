const router = require('express').Router();

const {
  // getUser,
  // getUsers,
  changeUserInfo,
  // changeAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  // validateGetUser,
  validateChangeUserInfo,
  // validateChangeAvatar,
} = require('../errors/validatorJoi');

// router.get('/users', getUsers); // показать всех пользователей
router.get('/users/me', getCurrentUser); // получить авторизованного пользователя
// router.get('/users/:userId', validateGetUser, getUser); // получить пользователя по айди
router.patch('/users/me', validateChangeUserInfo, changeUserInfo); // обновить информцию пользователя
// router.patch('/users/me/avatar', validateChangeAvatar, changeAvatar);
// обновить аватар пользователя

module.exports = router;

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/_id,
