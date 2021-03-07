const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  disallow, iff, isProvider,
} = require('feathers-hooks-common');
const { BadRequest } = require('@feathersjs/errors');
const {
  statusSoftDelete, verifyListOwner, validate, setUserId, verifyExists,
} = require('../../hooks');
const userHasAccessSchema = require('./user-has-access.schema');

const verifyNotAlreadyAccess = async (context) => {
  const { user_id: userId, list_id: listId } = context.data;
  const query = { $select: ['id'], user_id: userId, list_id: listId };
  const access = await context.app.service('user-has-access').find({ query });
  if (access.length > 0) {
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
      // TODO: Disallow not having access to list_id or not being user_id and document
      statusSoftDelete,
    ],
    get: [
      // TODO: Disallow not having access to list_id or not being user_id and document
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
