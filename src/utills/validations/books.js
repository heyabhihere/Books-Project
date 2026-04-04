const Joi = require('joi');

const bookSchema = Joi.object({
    bookName: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.number().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
});

module.exports = { bookSchema }
