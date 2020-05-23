const winston = require('winston');
const knexCleaner = require('knex-cleaner');
const knex = require('../src/knex')();

// Don't console log requests
winston.remove(winston.transports.Console);

// Make sure env is test
if (process.env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV is not test');
}

// Clear database
global.afterEach(() => knexCleaner.clean(knex));

jest.setTimeout(30000);
