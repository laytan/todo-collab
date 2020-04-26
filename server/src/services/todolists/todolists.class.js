const { Service } = require('feathers-nedb');

exports.Todolists = class Todolists extends Service {
  // Add authenticated user email as author
  async create(params, { user }) {
    params.author = user.email;
    return super.create(params);
  }
};
