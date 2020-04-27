const { addDefaultColumns, references } = require('../helpers');

exports.up = (knex) => knex.schema.createTable('events', (table) => {
  table.string('type').notNullable();
  table.string('service').notNullable();
  table.integer('id_in_service').unsigned().notNullable();
  table.text('description').nullable();

  addDefaultColumns(table);
  references(table, 'users', 'emitter');
});

exports.down = async (knex) => knex.schema.dropTableIfExists('events');
