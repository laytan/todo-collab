const Joi = require('@hapi/joi');

const usersSchema = Joi.object({
  username: Joi.string().min(2).max(25),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(200),
});

module.exports = usersSchema;
