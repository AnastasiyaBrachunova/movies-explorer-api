const router = require('express').Router();
const express = require('express'); // импортировали экспресс

const app = express(); // создали приложение

const auth = require('../middlewares/auth');

const authRouter = require('./auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');
const message = require('../utils/constant');

app.use('/', authRouter); // здесь роуты signup/signin
app.use(auth); // защита роутов авторизацией
app.use('/', auth, usersRouter);
app.use('/', auth, moviesRouter);

app.use('*', () => {
  throw new NotFoundError(message.NOT_FOUND_ERROR);
});

module.exports = router;
