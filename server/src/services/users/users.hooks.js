const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const {
  hashPassword, protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  iff, isProvider, preventChanges, discard,
} = require('feathers-hooks-common');
const accountService = require('../authmanagement/notifier');
const { unique, verifyOwner, statusSoftDelete } = require('../../hooks');

const stringifyVerifyChanges = (context) => {
  if (context.data.verifyChanges) {
    context.data.verifyChanges = JSON.stringify(context.data.verifyChanges);
  }
  return context;
};

module.exports = {
  before: {
    all: [
      statusSoftDelete,
    ],
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
    update: [],
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
        verifyOwner('id'),
        hashPassword('password'),
        authenticate('jwt'),
      ),
      // FIXME: What are these 0 and 1 keys?
      discard('0', '1'),
      stringifyVerifyChanges,
    ],
    remove: [
      authenticate('jwt'),
      verifyOwner('id'),
    ],
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
        // Don't send email when @localhost is in the email
        if (context.result.email.indexOf('@localhost') === -1) {
          accountService(context.app).notifier('resendVerifySignup', context.result);
        }
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
