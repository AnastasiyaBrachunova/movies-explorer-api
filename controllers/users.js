const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const ConflictError = require('../errors/ConflictError');

const SALT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => { // создание пользователя signup
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;
      res.status(201).send(userWithoutPass);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(error);
      }
    });
};

const getCurrentUser = (req, res, next) => { // получение текущего (авторизованного) пользователя
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для получения пользователя'));
      } else {
        next(err);
      }
    });
};

// const login = (req, res, next) => { // авторизация(получение токена) signin
//   const { email, password } = req.body;
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign(
//         { _id: user._id },
//         NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
//         { expiresIn: '7d' },
//       );
//       res.send({ token });
//     }).catch(() => {
//       next(new AuthorizationError('Ошибка авторизации'));
//     });
// };

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Ошибка авторизации');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError('Ошибка авторизации');
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          res.send({ token });
        });
    }).catch(next);
};

const changeUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, email } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((users) => res.send(users))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении данных пользователя'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createUser,
  changeUserInfo,
  login,
  getCurrentUser,
};