const { authenticate } = require('@feathersjs/authentication').hooks;
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
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [disallow('external')],
    update: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external')],
  },

  after: {
    all: [],
    find: [populate({ schema: eventsEmitterSchema })],
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
