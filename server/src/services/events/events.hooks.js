const { disallow, populate } = require('feathers-hooks-common');

const eventsEmitterSchema = {
  include: {
    service: 'users',
    nameAs: 'emitter',
    parentField: 'emitter_id',
    childField: 'id',
  },
};

module.exports = {
  before: {
    all: [
      disallow('external'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [
      populate({ schema: eventsEmitterSchema }),
    ],
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
