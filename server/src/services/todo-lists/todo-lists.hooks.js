const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const { populate, iff, isProvider, checkContext } = require('feathers-hooks-common');
const { Forbidden } = require('@feathersjs/errors');
const {
  setUserId, statusSoftDelete, verifyListOwner, validate, withoutProvider,
} = require('../../hooks');
const { registerEvent } = require('../../hooks/events');
const { getAccessibleLists } = require('../../helpers');
const todoListsSchema = require('./todo-lists.schema');

// Add a user_has_access record for the owner of the list
const addAccessForOwner = (context) => context.app.service('user-has-access').create({
  user_id: context.result.owner_id,
  list_id: context.result.id,
}).then(() => context);

const joinEvents = populate({
  schema: {
    include: {
      service: 'events',
      nameAs: 'events',
      parentField: 'id',
      childField: 'id_in_service',
      useInnerPopulate: true,
      asArray: true,
      query: {
        service: 'todo-lists',
      },
    },
  },
});

const joinItems = populate({
  schema: {
    include: {
      service: 'todos',
      nameAs: 'items',
      parentField: 'id',
      childField: 'list_id',
      useInnerPopulate: true,
      asArray: true,
    },
  },
});

const verifyListAccess = async (context) => {
  checkContext(context, 'before', ['get', 'patch'], 'verifyListAccess');
  const listId = context.id;
  const access = await getAccessibleLists(context.params.user.id, context.app);

  if (!access.includes(listId)) {
    throw new Forbidden('You do not have access to this list.');
  }

  return context;
};

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      statusSoftDelete,
    ],
    find: [],
    get: [
      iff(isProvider('external'), verifyListAccess),
    ],
    create: [
      validate(todoListsSchema, { requireAll: true }),
      hashPassword('password'),
      setUserId('owner_id'),
    ],
    update: [],
    patch: [
      iff(isProvider('external'), validate(todoListsSchema, {})),
      hashPassword('password'),
      verifyListAccess,
    ],
    remove: [
      verifyListOwner('id'),
    ],
  },

  after: {
    all: [
      protect('password'),
    ],
    find: [],
    get: [
      withoutProvider(joinEvents),
      // Can join without provider because all lists are already verified accessible so the items asswel
      withoutProvider(joinItems),
      protect('_include'),
    ],
    create: [
      addAccessForOwner,
      registerEvent({}),
    ],
    update: [
      registerEvent({}),
    ],
    patch: [
      registerEvent({}),
    ],
    remove: [
      registerEvent({}),
    ],
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
