const express = require('express');
const mongoose = require('mongoose');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');
const { isEmail, isURL } = require('validator');
const cors = require('cors');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(cors());
app.use(requestLogger);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'string.notEmail': 'Email некорректный',
      'any.required': 'Email не указан',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
    }),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helper) => {
      if (!isURL(value, { require_protocol: true })) {
        return helper.error('string.notURL');
      }
      return value;
    }).messages({
      'string.notURL': 'Адрес некорректный',
      'any.required': 'Ссылка не указана',
    }),
    email: Joi.string().required().custom((value, helper) => {
      if (!isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'string.notEmail': 'Email некорректный',
      'any.required': 'Email не указан',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
    }),
  }),
}), createUser);

app.use('/', () => {
  throw new ErrorNotFound('Указан неверный путь');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт ${PORT}`);
});
