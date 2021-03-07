const { disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    // TODO: Disallow find and get to users with access to the list/todo of this event and document
    find: [],
    get: [],
    create: [
      disallow('external'),
    ],
    update: [
      disallow(),
    ],
    patch: [
      disallow(),
    ],
    remove: [
      disallow(),
    ],
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
