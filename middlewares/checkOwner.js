const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');

module.exports = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (JSON.stringify(card.owner).replace(/"/g, '') !== req.user._id) {
        throw new Forbidden('Нет прав');
      }
      next();
    })
    .catch(next);
};
