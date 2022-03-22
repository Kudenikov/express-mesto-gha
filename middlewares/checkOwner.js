const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');
const ErrorNotFound = require('../errors/ErrorNotFound');

module.exports = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((card) => {
      if (JSON.stringify(card.owner).replace(/"/g, '') !== req.user._id) {
        throw new Forbidden('Нет прав');
      }
      next();
    })
    .catch(next);
};
