const Joi = require('@hapi/joi');

const todoListsSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(500).allow(''),
  password: Joi.string().min(6).max(200).regex(/^\S*$/, 'password'), // No whitespace
});

module.exports = todoListsSchema;
