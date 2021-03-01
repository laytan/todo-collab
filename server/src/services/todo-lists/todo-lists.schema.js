const Joi = require('@hapi/joi');

const todoListsSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(500).allow(''),
});

module.exports = todoListsSchema;
