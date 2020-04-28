const { disallow } = require('feathers-hooks-common');
const { logRequest } = require('./hooks');

// Application hooks that run for every service
module.exports = {
  before: {
    all: [
      logRequest,
    ],
    find: [],
    get: [],
    create: [],
    update: [
      disallow('external'),
    ],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
