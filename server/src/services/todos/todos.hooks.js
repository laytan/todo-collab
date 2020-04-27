const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common');
const { convertCompleted, convertPopulateOutputToArr } = require('../../hooks');
const { registerEvent, dGetType } = require('../../hooks/events');

const todosEventsSchema = {
  include: {
    service: 'events',
    nameAs: 'events',
    parentField: 'id',
    childField: 'id_in_service',
    useInnerPopulate: true,
    query: {
      service: 'todos',
    },
  },
};

const completedEvents = registerEvent({
  getType: (context) => {
    const at = context.data.completed_at;
    // If it was changed
    if (at !== undefined) {
      return at === null ? 'UNCOMPLETE' : 'COMPLETE';
    }

    return dGetType(context);
  },
});

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [convertCompleted],
    patch: [convertCompleted],
    remove: [],
  },

  after: {
    all: [],
    find: [populate({ schema: todosEventsSchema }), convertPopulateOutputToArr('events')],
    get: [],
    create: [registerEvent({})],
    update: [completedEvents],
    patch: [completedEvents],
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
