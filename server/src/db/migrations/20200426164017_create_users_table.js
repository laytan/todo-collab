const { addDefaultColumns } = require('../helpers');

exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table.string('username', 25).notNullable().unique();
  table.string('email').notNullable().unique();
  table.string('password').notNullable();

  // feathers-authentication-management
  table.boolean('isVerified').defaultTo(false);
  table.string('verifyToken').nullable();
  table.string('verifyShortToken').nullable();
  table.bigInteger('verifyExpires').nullable();
  table.json('verifyChanges').nullable();
  table.string('resetToken').nullable();
  table.string('resetShortToken').nullable();
  table.bigInteger('resetExpires').nullable();

  addDefaultColumns(table);
});

exports.down = (knex) => knex.schema.dropTableIfExists('users');
