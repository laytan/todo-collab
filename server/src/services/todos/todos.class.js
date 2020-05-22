const { Service } = require('feathers-knex');
const { getAccessibleLists } = require('../../helpers');

exports.Todos = class Todos extends Service {
  constructor(options, app) {
    super({
      ...options,
      name: 'todos',
    });

    this.app = app;
  }

  async find(params) {
    if (params.provider) {
      const userId = params.user.id;

      // get lists the user has access to
      const access = await getAccessibleLists(userId, this.app);
      // query todos scoped to the lists that the user has access to on list_id
      const todos = this.app.service('todos').find({ query: { ...params.query, list_id: { $in: access } } });
      return todos;
    }
    return this._find(params);
  }
};
