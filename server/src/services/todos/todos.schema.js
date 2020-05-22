const Joi = require('@hapi/joi');

const todosSchema = Joi.object({
  order: Joi.number().min(0),
  name: Joi.string().min(2).max(50),
  description: Joi.string().max(500).allow(''),
  label: Joi.string().max(50),
  color: Joi.string().min(3).max(6).regex(/^#[0-9a-f]{3,6}$/i, 'color'),
  list_id: Joi.number(),
});

const updateTodosSchema = Joi.object({
  order: Joi.number().min(0),
  name: Joi.string().min(2).max(50),
  description: Joi.string().max(500).allow(''),
  label: Joi.string().max(50),
  color: Joi.string().min(3).max(6).regex(/^#[0-9a-f]{3,6}$/i, 'color'),
  completed: Joi.bool(),
});

module.exports = {
  todosSchema,
  updateTodosSchema,
};
