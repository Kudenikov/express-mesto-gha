const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        res.status(400).send({ message: errorMessage });
      } else { return res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else { return res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else { return res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else { return res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};
