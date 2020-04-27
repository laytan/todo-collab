const { Service } = require('feathers-knex');

exports.Events = class Events extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'events',
    });
  }
};
