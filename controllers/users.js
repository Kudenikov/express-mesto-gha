const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({data: users}))
  .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
  .orFail(() => {
    throw new ErrorNotFound(`Нет пользователя с id ${req.params.userId}`);
  })
  .then(user => res.send({data: user}))
  .catch((err)=>{
    if (err.statusCode === 404){
      res.status(404).send({ message: err.errorMessage });
    } else
    return res.status(500).send({message: 'Произошла ошибка'})
  })
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then(user => res.send({data: user}))
  .catch((err) => {
    if (err._message.toLowerCase().includes('validation')) {
      let errorMessage = 'Переданы неверные данные: ';
      const errorValues = Object.values(err.errors);
      errorValues.forEach((errVal) => {
        if (typeof errVal === 'object') {
          errorMessage += `Ошибка в поле ${errVal.path} `;
        }
      })
      res.status(400).send({message: errorMessage})
    } else
    return res.status(500).send({message: 'Произошла ошибка'})
  });
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
  .then(user => res.send({data: user}))
  .catch((err) => {
    if (err._message.toLowerCase().includes('validation')) {
      let errorMessage = 'Переданы неверные данные: ';
      const errorValues = Object.values(err.errors);
      errorValues.forEach((errVal) => {
        if (typeof errVal === 'object') {
          errorMessage += `Ошибка в поле ${errVal.path} `;
        }
      })
      res.status(400).send({message: errorMessage})
    } else
    return res.status(500).send({message: 'Произошла ошибка'})
  });
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
  .then(user => res.send({data: user}))
  .catch((err) => {
    if (err._message.toLowerCase().includes('validation')) {
      let errorMessage = 'Переданы неверные данные: ';
      const errorValues = Object.values(err.errors);
      errorValues.forEach((errVal) => {
        if (typeof errVal === 'object') {
          errorMessage += `Ошибка в поле ${errVal.path} `;
        }
      })
      res.status(400).send({message: errorMessage})
    } else
    return res.status(500).send({message: 'Произошла ошибка'})
  });
}