const users = require('./users/users.service.js');
const todolists = require('./todolists/todolists.service.js');
const todos = require('./todos/todos.service.js');
const mailer = require('./mailer/mailer.service.js');
const authmanagement = require('./authmanagement/authmanagement.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function services(app) {
  app.configure(users);
  app.configure(todolists);
  app.configure(todos);
  app.configure(mailer);
  app.configure(authmanagement);
};
