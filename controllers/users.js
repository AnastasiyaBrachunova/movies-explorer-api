const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const ConflictError = require('../errors/ConflictError');
const message = require('../utils/constant');

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
        next(new BadRequest(message.BAD_REQUEST_ERROR));
      } else if (error.code === 11000) {
        next(new ConflictError(message.CONFLICT_ERROR));
      } else {
        next(error);
      }
    });
};

const getCurrentUser = (req, res, next) => { // получение текущего (авторизованного) пользователя
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError(message.NOT_FOUND_ERROR))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(message.AUTHORIZATION_ERROR);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError(message.AUTHORIZATION_ERROR);
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
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError(message.NOT_FOUND_ERROR))
    .then((users) => res.send(users))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(message.BAD_REQUEST_ERROR));
      } else if (error.code === 11000) {
        next(new ConflictError(message.CONFLICT_ERROR));
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
