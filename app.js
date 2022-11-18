require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express'); // импортировали экспресс
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { options } = require('./utils/cors');
const limiter = require('./utils/rateLimiter');
const { MONGO_DB } = require('./utils/config');

const { requestLogger, errorLogger } = require('./middlewares/logger'); // ИМПОРТ ЛОГОВ

const routes = require('./routes/index');
const internalError = require('./errors/internalError');

const app = express(); // создали приложение
app.use(helmet()); // устанавливаt различные HTTP-заголовки для защиты приложения

const {
  PORT = 3000,
  MONGO_PROD,
  NODE_ENV,
} = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_PROD : MONGO_DB);

app.use('*', cors(options));

app.use(express.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger); // ЛОГГЕР ЗАПРОСОВ

app.use(limiter); // ограничитель скорости запросов

app.use(routes);

app.use(errorLogger); // ЛОГГЕР ОШИБОК

app.use(errors());

app.use(internalError);

app.listen(PORT); // запускаем сервер на порту 3000
