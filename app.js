const express = require('express');
const mongoose = require('mongoose');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');
const { isEmail } = require('validator');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
mongoose.connect('mongodb://localhost:27017/mestodb');

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
    avatar: Joi.string(),
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

app.use('/', (req, res) => res.status(404).send({ message: 'Указан неверный путь' }));

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error) {
    return res.status(400).send({ message: err.message });
  }
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт ${PORT}`);
});
