const router = require('express').Router();

const {
  changeUserInfo,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateChangeUserInfo,
} = require('../errors/validatorJoi');

router.get('/users/me', getCurrentUser); // получить авторизованного пользователя
router.patch('/users/me', validateChangeUserInfo, changeUserInfo); // обновить информцию пользователя

module.exports = router;
