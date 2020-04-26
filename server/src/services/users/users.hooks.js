const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const {
  hashPassword, protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  disallow, iff, isProvider, preventChanges,
} = require('feathers-hooks-common');
const accountService = require('../authmanagement/notifier');

/**
 * Set a unique contraint
 */
const unique = (table, column, errorMsg) => async (context) => {
  const check = context.data[column];
  if (!check) {
    return context;
  }

  const query = {};
  query[column] = check;
  const results = await context.app.service(table).find(query);
  if (results.data.length > 0) {
    throw new Error(errorMsg);
  }

  return context;
};

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword('password'), unique('users', 'email', 'Email is already used.'), verifyHooks.addVerification()],
    // Don't allow any updating from external calls
    update: [disallow('external')],
    // Don't allow external calls to change verification fields
    patch: [
      iff(
        isProvider('external'),
        preventChanges(true, [
          'email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires',
        ]),
        hashPassword('password'),
        authenticate('jwt'),
      ),
    ],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [
      (context) => {
        accountService(context.app).notifier('resendVerifySignup', context.result);
      },
      verifyHooks.removeVerification(),
    ],
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
