const { Service } = require('feathers-knex');

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
   * TODO: This voids the params.query passed so it will always return all results
   */
  async find(params) {
    if (params.provider) {
      const userId = params.user.id;
      return this.app.service('user-has-access').find({ query: { user_id: userId } })
        .then((res) => res.data.map((userHasAccess) => userHasAccess.todoList))
        .catch((e) => e);
    }
    return this._find(params);
  }
};
