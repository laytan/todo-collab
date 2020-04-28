const { references, addDefaultColumns } = require('../helpers');

exports.up = (knex) => knex.schema.createTable('user_has_access', (table) => {
  addDefaultColumns(table);
  references(table, 'users', 'granter');
  references(table, 'users', 'user');
  references(table, 'todo_lists', 'list');
});

exports.down = (knex) => knex.schema.dropTableIfExists('user_has_access');
