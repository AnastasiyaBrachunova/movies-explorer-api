const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено!'],
    minlength: 2,
    maxlength: 30,
    default: '',
  },
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено!'],
    unique: true,
    validate: {
      validator(email) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
        return emailRegex.test(email);
      },
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено!'],
    select: false,
  },

});

module.exports = mongoose.model('user', userSchema);
