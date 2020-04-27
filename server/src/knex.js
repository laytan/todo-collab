const knex = require('knex');

module.exports = (app) => {
  const { client, connection } = app.get('mysql');
  const db = knex({ client, connection });

  app.set('knexClient', db);
};
