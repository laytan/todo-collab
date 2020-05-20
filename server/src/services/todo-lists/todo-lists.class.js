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
   */
  async find(params) {
    if (params.provider) {
      const userId = params.user.id;
      
      // Retrieve the list id's for all lists the user has access to
      const accessObjects = await this.app.service('user-has-access').find({ paginate: false, query: { user_id: userId, $select: ['list_id'], } });
      const accessableListIds = accessObjects.map(accessObject => accessObject.list_id);

      // Return the lists matching the user's query that the user has access to
      const query = { ...params.query, id: { $in: accessableListIds } };
      const lists = this.app.service('todo-lists').find({ query });
      return lists;
    }

    return this._find(params);
  }
};
