// Initializes the `user-has-access` service on path `/user-has-access`
const { UserHasAccess } = require('./user-has-access.class');
const hooks = require('./user-has-access.hooks');

module.exports = (app) => {
  const options = {
    Model: app.get('knexClient'),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/user-has-access', new UserHasAccess(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-has-access');

  service.hooks(hooks);
};
