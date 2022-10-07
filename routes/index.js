// const router = require('express').Router();

// const auth = require('../middlewares/auth');

// const authRouter = require('./auth');
// const usersRouter = require('./users');
// const moviesRouter = require('./movies');

// const NotFoundError = require('../errors/NotFoundError');
// const message = require('../utils/constant');

// router.use('/', authRouter); // здесь роуты signup/signin
// router.use(auth); // защита роутов авторизацией
// router.use('/', auth, usersRouter);
// router.use('/', auth, moviesRouter);

// router.use('*', () => {
//   throw new NotFoundError(message.NOT_FOUND_ERROR);
// });

// module.exports = router;
