// Initializes the `todoLists` service on path `/todo-lists`
const { TodoLists } = require('./todo-lists.class');
const hooks = require('./todo-lists.hooks');

module.exports = (app) => {
  const options = {
    Model: app.get('knexClient'),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/todo-lists', new TodoLists(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('todo-lists');

  service.hooks(hooks);
};
