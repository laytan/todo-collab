const { authenticate } = require('@feathersjs/authentication').hooks;
const { convertCompleted } = require('../../hooks');
const { registerEvent, dGetType } = require('../../hooks/events');

const completedEvents = registerEvent({
  types: ['UNCOMPLETE', 'COMPLETE'],
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
    find: [],
    get: [],
    create: [],
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
