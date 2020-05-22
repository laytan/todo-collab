const knex = require('knex');
const config = require('../knexfile.js');

module.exports = (app) => {
  const environment = process.env.NODE_ENV || 'development';
  const environmentConfig = config[environment];
  const db = knex(environmentConfig);

  if (app) {
    app.set('knexClient', db);
  }

  return db;
};
