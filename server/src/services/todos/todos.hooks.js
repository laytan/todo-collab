const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  iff, isProvider,
} = require('feathers-hooks-common');
const { Forbidden } = require('@feathersjs/errors');
const { registerEvent, dGetType } = require('../../hooks/events');
const { dependsOnMethod } = require('../../helpers');
const { statusSoftDelete, validate } = require('../../hooks');
const { todosSchema, updateTodosSchema } = require('./todos.schema');

// Converts completed boolean into done_by and completed_at
const convertCompleted = (context) => {
  if (context.data.completed !== undefined) {
    const { completed } = context.data;
    delete context.data.completed;

    if (completed) {
      context.data.done_by_user_id = context.params.user.id;
      context.data.completed_at = new Date();
    } else {
      context.data.done_by_user_id = null;
      context.data.completed_at = null;
    }
  }

  return context;
};

/**
 * Verify that the user making this request has access to the list this todo belongs in
 */
const verifyListAccess = async (context) => {
  const lists = await dependsOnMethod(
    context,
    (id) => context.app.service('todos').get(id).then((todo) => context.app.service('todo-lists').get(todo.list_id)),
    'id',
    {
      create: () => context.app.service('todo-lists').get(context.data.list_id),
    },
  );

  const userHasAccesses = await Promise.all(lists.map((list) => context.app.service('user-has-access').find({ query: { user_id: context.params.user.id, list_id: list.id } })));

  if (userHasAccesses.length !== lists.length) {
    throw new Forbidden('You do not have access to the list of this item.');
  }

  return context;
};

const registerCompletedEvent = registerEvent({
  getType: (context) => {
    const at = context.data.completed_at;
    // If it was changed
    if (at !== undefined) {
      return at === null ? 'UNCOMPLETE' : 'COMPLETE';
    }

    return dGetType(context);
  },
  describe: (context) => {
    let described = `Name: ${context.result.name}`;

    // TODO: prettier
    described += `, Changes: ${JSON.stringify(context.data, null, 2)}`;

    return described;
  },
});

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
      validate(todosSchema, { requireAll: true }),
      iff(isProvider('external'), verifyListAccess),
    ],
    update: [],
    patch: [
      iff(isProvider('external'), validate(updateTodosSchema, {}), verifyListAccess),
      convertCompleted,
    ],
    remove: [
      iff(isProvider('external'), verifyListAccess),
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      registerEvent({
        describe: (ctx) => `Name: ${ctx.result.name}`,
      }),
    ],
    update: [],
    patch: [
      registerCompletedEvent,
    ],
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
