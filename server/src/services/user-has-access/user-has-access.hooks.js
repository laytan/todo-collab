const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate, disallow } = require('feathers-hooks-common');
const { verifyOwner, statusSoftDelete, verifyListOwner } = require('../../hooks');

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
      verifyListOwner('list_id'),
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
