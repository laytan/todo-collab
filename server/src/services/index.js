const users = require('./users/users.service.js');
const todolists = require('./todolists/todolists.service.js');
const todos = require('./todos/todos.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(todolists);
  app.configure(todos);
};
