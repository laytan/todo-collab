// Initializes the `authmanagement` service on path `/authmanagement`
const AuthManagement = require('feathers-authentication-management');
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');

module.exports = function authmanagement(app) {
  // Initialize our service with any options it requires
  app.configure(AuthManagement(notifier(app)));

  // Get our initialized service so that we can register hooks
  const service = app.service('authManagement');

  service.hooks(hooks);
};
