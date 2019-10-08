const { Service } = require('feathers-nedb');

exports.Todos = class Todos extends Service {

  // Add authenticated user email as author and last editor
  async create(params, { user }) {
    params.author = user.email;
    params.lastEditedBy = user.email;
    return super.create(params);
  }
};
