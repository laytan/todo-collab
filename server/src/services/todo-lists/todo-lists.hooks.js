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
    find: [populate({ schema: todoListItemsSchema }), convertPopulateOutputToArr('items')],
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
