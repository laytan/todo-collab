// Initializes the `todolists` service on path `/todolists`
const { Todolists } = require('./todolists.class');
const createModel = require('../../models/todolists.model');
const hooks = require('./todolists.hooks');

module.exports = function todolists(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/todolists', new Todolists(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('todolists');

  service.hooks(hooks);
};
