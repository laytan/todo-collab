const { addDefaultColumns, references } = require('../helpers');

exports.up = (knex) => knex.schema.createTable('todo_lists', (table) => {
  table.string('name', 100).notNullable();
  table.text('description').notNullable();
  table.string('password').notNullable();

  addDefaultColumns(table);
  references(table, 'users', 'owner');
});

exports.down = async (knex) => knex.schema.dropTableIfExists('todo_lists');
