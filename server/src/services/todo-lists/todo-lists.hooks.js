const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const { populate } = require('feathers-hooks-common');
const {
  addAccessForOwner, setUserId, convertPopulateOutputToArr,
} = require('../../hooks');
const { registerEvent } = require('../../hooks/events');

const todoListItemsSchema = {
  include: {
    service: 'todos',
    nameAs: 'items',
    parentField: 'id',
    childField: 'list_id',
    useInnerPopulate: true,
  },
};

const todoListEventsSchema = {
  include: {
    service: 'events',
    nameAs: 'events',
    parentField: 'id',
    childField: 'id_in_service',
    useInnerPopulate: true,
    query: {
      service: 'todo-lists',
    },
  },
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [hashPassword('password'), setUserId('owner_id')],
    update: [hashPassword('password')],
    patch: [hashPassword('password')],
    remove: [],
  },

  after: {
    all: [],
    find: [populate({ schema: todoListItemsSchema }), populate({ schema: todoListEventsSchema }), convertPopulateOutputToArr('items'), convertPopulateOutputToArr('events')],
    get: [populate({ schema: todoListItemsSchema }), convertPopulateOutputToArr('items')],
    create: [addAccessForOwner, registerEvent({})],
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
