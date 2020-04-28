const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const { populate, protect } = require('feathers-hooks-common');
const { Forbidden } = require('@feathersjs/errors');
const { setUserId, statusSoftDelete, verifyListOwner } = require('../../hooks');
const { registerEvent } = require('../../hooks/events');
const { dependsOnMethod } = require('../../helpers');

// Add a user_has_access record for the owner of the list
const addAccessForOwner = (context) => context.app.service('user-has-access').create({
  user_id: context.result.owner_id,
  list_id: context.result.id,
}).then(() => context).catch((e) => e);

const joinEvents = populate({
  schema: {
    clude: {
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
  const lists = await dependsOnMethod(
    context,
    (listId) => context.app.service('todo-lists').get(listId),
  );

  const userHasAccesses = await Promise.all(lists.map((list) => context.app.service('user-has-access').find({ paginate: false, query: { user_id: context.user.id, list_id: list.id } })));

  if (userHasAccesses.length !== lists.length) {
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
      verifyListAccess,
    ],
    create: [
      hashPassword('password'),
      setUserId('owner_id'),
    ],
    update: [],
    patch: [
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
      joinEvents,
      joinItems,
    ],
    create: [
      addAccessForOwner,
      registerEvent(),
    ],
    update: [
      registerEvent(),
    ],
    patch: [
      registerEvent(),
    ],
    remove: [
      registerEvent(),
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
