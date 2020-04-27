const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common');

const userHasAccessListSchema = {
  include: {
    service: 'todo-lists',
    nameAs: 'todoList',
    parentField: 'list_id',
    childField: 'id',
  },
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [populate({ schema: userHasAccessListSchema })],
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
