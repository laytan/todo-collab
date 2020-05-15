const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  populate, disallow, iff, isProvider,
} = require('feathers-hooks-common');
const {
  verifyOwner, statusSoftDelete, verifyListOwner, validate,
} = require('../../hooks');
const userHasAccessSchema = require('./user-has-access.schema');

const joinList = populate({
  schema: {
    include: {
      service: 'todo-lists',
      nameAs: 'todoList',
      parentField: 'list_id',
      childField: 'id',
    },
  },
});

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      statusSoftDelete,
    ],
    find: [
      disallow('external'),
    ],
    get: [
      disallow('external'),
    ],
    create: [
      validate(userHasAccessSchema, { requireAll: true }),
      iff(isProvider('external'), verifyListOwner('list_id')),
    ],
    update: [],
    patch: [
      disallow('external'),
    ],
    remove: [
      verifyOwner('granter_id'),
    ],
  },

  after: {
    all: [],
    find: [],
    get: [
      joinList,
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
