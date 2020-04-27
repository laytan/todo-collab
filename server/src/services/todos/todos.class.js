const { Service } = require('feathers-knex');

exports.Todos = class Todos extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'todos',
    });
  }
};
