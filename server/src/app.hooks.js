// Application hooks that run for every service

const logRequest = async (context) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toLocaleTimeString()}] ${context.method.toUpperCase()} ${context.path}`);
  return context;
};

module.exports = {
  before: {
    all: [logRequest],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
