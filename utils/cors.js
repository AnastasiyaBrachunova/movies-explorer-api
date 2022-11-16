const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://brachunova.diplom.nomoredomains.icu', // будущий домен фронта
    'https://brachunova.diplom.nomoredomains.icu',
    'http://api.brachunova.diplom.nomoredomains.icu', // будущий домен фронта
    'https://api.brachunova.diplom.nomoredomains.icu',
    'https://AnastasiyaBrachunova.github.io',
    'http://AnastasiyaBrachunova.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Accept', 'X-Requested-With', 'Content-Type', 'Origin', 'Authorization'],
  credentials: true,
};

module.exports = {
  options,
};
