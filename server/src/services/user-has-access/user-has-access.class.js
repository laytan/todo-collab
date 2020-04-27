const { Service } = require('feathers-knex');

exports.UserHasAccess = class UserHasAccess extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'user_has_access',
    });
  }
};
