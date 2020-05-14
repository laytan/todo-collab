const Joi = require('@hapi/joi');

const userHasAccessSchema = Joi.object({
  user_id: Joi.number().min(0),
  list_id: Joi.number().min(0),
});

module.exports = userHasAccessSchema;
