const { Service } = require('feathers-knex');
const { getAccessibleLists } = require('../../helpers');

exports.TodoLists = class TodoLists extends Service {
  constructor(options, app) {
    super({
      ...options,
      name: 'todo_lists',
    });

    this.app = app;
  }

  /**
   * If the call is external, only return the lists that the user has access to
   *
   */
  async find(params) {
    if (params.provider) {
      const userId = params.user.id;

      const accessableListIds = await getAccessibleLists(userId, this.app);

      // Return the lists matching the user's query that the user has access to
      const query = { ...params.query, id: { $in: accessableListIds } };
      const lists = this.app.service('todo-lists').find({ query });
      return lists;
    }

    return this._find(params);
  }
};
