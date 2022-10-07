require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express'); // импортировали экспресс
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const options = require('./utils/cors');
const limiter = require('./utils/rateLimiter');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // ИМПОРТ ЛОГОВ

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const NotFoundError = require('./errors/NotFoundError');
const internalError = require('./errors/internalError');

const app = express(); // создали приложение
app.use(helmet()); // устанавливаt различные HTTP-заголовки для защиты приложения

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use('*', cors(options));

app.use(express.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger); // ЛОГГЕР ЗАПРОСОВ

app.use(limiter); // ограничитель скорости запросов

app.use('/', authRouter); // здесь роуты signup/signin
app.use(auth); // защита роутов авторизацией
app.use('/', auth, usersRouter);
app.use('/', auth, moviesRouter);

app.use(errorLogger); // ЛОГГЕР ОШИБОК

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(internalError);

app.listen(PORT); // запускаем сервер на порту 3000
