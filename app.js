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
const { MONGO_DB } = require('./utils/config');

// const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // ИМПОРТ ЛОГОВ

// const authRouter = require('./routes/auth');
// const usersRouter = require('./routes/users');
// const moviesRouter = require('./routes/movies');

// const message = require('./utils/constant');

// const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes/index');
const internalError = require('./errors/internalError');

const app = express(); // создали приложение
app.use(helmet()); // устанавливаt различные HTTP-заголовки для защиты приложения

// console.log(MONGO_DB);

const {
  PORT = 3000,
  // MONGO_PROD,
  // NODE_ENV,
} = process.env;

mongoose.connect(MONGO_DB);

// mongoose.connect(MONGO_DB);

app.use('*', cors(options));

app.use(express.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger); // ЛОГГЕР ЗАПРОСОВ

app.use(limiter); // ограничитель скорости запросов

app.use(routes);
// app.use('/', authRouter); // здесь роуты signup/signin
// app.use(auth); // защита роутов авторизацией
// app.use('/', auth, usersRouter);
// app.use('/', auth, moviesRouter);

// app.use((req, res, next) => {
//   next(new NotFoundError(message.NOT_FOUND_ERROR));
// });

app.use(errorLogger); // ЛОГГЕР ОШИБОК

app.use(errors());

app.use(internalError);

app.listen(PORT); // запускаем сервер на порту 3000
