const users = require('./users/users.service.js');
const todos = require('./todos/todos.service.js');
const mailer = require('./mailer/mailer.service.js');
const authmanagement = require('./authmanagement/authmanagement.service.js');
const todoLists = require('./todo-lists/todo-lists.service.js');
const userHasAccess = require('./user-has-access/user-has-access.service.js');
const events = require('./events/events.service.js');

module.exports = function services(app) {
  app.configure(users);
  app.configure(todos);
  app.configure(mailer);
  app.configure(authmanagement);
  app.configure(todoLists);
  app.configure(userHasAccess);
  app.configure(events);
};
