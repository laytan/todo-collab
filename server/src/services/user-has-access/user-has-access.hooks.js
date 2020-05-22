const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  populate, disallow, iff, isProvider,
} = require('feathers-hooks-common');
const {
  statusSoftDelete, verifyListOwner, validate, setUserId, verifyExists,
} = require('../../hooks');
const userHasAccessSchema = require('./user-has-access.schema');
const { BadRequest } = require('@feathersjs/errors');

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

const verifyNotAlreadyAccess = async context => {
  const { user_id, list_id } = context.data;
  const access = await context.app.service('user-has-access').find({ paginate: false, query: { $select: ['id'], user_id, list_id } });
  if(access.length > 0) {
    throw new BadRequest('User already has access to this list.');
  }
  return context;
};

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      disallow('external'),
      statusSoftDelete,
    ],
    get: [
      disallow('external'),
      statusSoftDelete,
    ],
    create: [
      validate(userHasAccessSchema, { requireAll: true }),
      statusSoftDelete,
      verifyNotAlreadyAccess,
      iff(isProvider('external'), verifyListOwner('list_id'), setUserId('granter_id'), verifyExists('users', 'user_id')),
    ],
    update: [],
    patch: [
      disallow('external'),
      statusSoftDelete,
    ],
    remove: [],
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
