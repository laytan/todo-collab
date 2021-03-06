// Initializes the `todos` service on path `/todos`
const { Todos } = require('./todos.class');
const hooks = require('./todos.hooks');

module.exports = (app) => {
  const options = {
    Model: app.get('knexClient'),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/todos', new Todos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('todos');

  service.hooks(hooks);
};
