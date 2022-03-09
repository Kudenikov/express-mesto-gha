const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`Слушаем порт ${PORT}`);
});
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6225c6a596358655a3e72734',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req, res) => res.status(404).send({ message: 'Указан неверный путь' }));

mongoose.connect('mongodb://localhost:27017/mestodb');
