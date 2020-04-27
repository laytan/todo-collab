const { addDefaultColumns, references } = require('../helpers');

exports.up = (knex) => knex.schema.createTable('todos', (table) => {
  table.integer('order').defaultTo(0);
  table.string('name', 50).notNullable();
  table.text('description').nullable();

  table.string('label', 50).nullable();
  table.string('color', 50).nullable();

  table.timestamp('completed_at').nullable();

  addDefaultColumns(table);
  references(table, 'users', 'done_by_user');
  references(table, 'todo_lists', 'list');
});

exports.down = async (knex) => knex.schema.dropTableIfExists('todos');
