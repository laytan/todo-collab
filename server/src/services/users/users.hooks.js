const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const {
  hashPassword, protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  disallow, iff, isProvider, preventChanges, discard,
} = require('feathers-hooks-common');
const accountService = require('../authmanagement/notifier');
const { stringifyVerifyChanges, unique } = require('../../hooks');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      hashPassword('password'),
      unique('users', 'username', 'Username is already in use.'),
      unique('users', 'email', 'Email is already in use.'),
      verifyHooks.addVerification(),
      stringifyVerifyChanges,
      // FIXME: What are these 0 and 1 keys?
      discard('0', '1'),
    ],
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
      // FIXME: What are these 0 and 1 keys?
      discard('0', '1'),
      stringifyVerifyChanges,
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
