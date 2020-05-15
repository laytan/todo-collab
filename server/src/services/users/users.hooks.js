const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const {
  hashPassword, protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  iff, isProvider, preventChanges, discard,
} = require('feathers-hooks-common');
const { Forbidden } = require('@feathersjs/errors');
const accountService = require('../authmanagement/notifier');
const { niceUniqueConstraintError, statusSoftDelete, validate } = require('../../hooks');
const usersSchema = require('./users.schema');
const { getIdsEffected } = require('../../helpers');

const stringifyVerifyChanges = (context) => {
  if (context.data.verifyChanges) {
    context.data.verifyChanges = JSON.stringify(context.data.verifyChanges);
  }
  return context;
};

const verifySelf = (context) => {
  const id = getIdsEffected(context)[0];
  if (id !== context.params.user.id) {
    throw new Forbidden('You can only delete your own account.');
  }
  return context;
};

module.exports = {
  before: {
    all: [
    ],
    find: [
      authenticate('jwt'),
      statusSoftDelete,
    ],
    get: [
      authenticate('jwt'),
      statusSoftDelete,
    ],
    create: [
      validate(usersSchema, { requireAll: true }),
      statusSoftDelete,
      hashPassword('password'),
      verifyHooks.addVerification(),
      stringifyVerifyChanges,
      // FIXME: What are these 0 and 1 keys?
      discard('0', '1'),
    ],
    update: [],
    // Don't allow external calls to change verification fields
    patch: [
      statusSoftDelete,
      iff(
        isProvider('external'),
        validate(usersSchema, {}),
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
        verifySelf,
        hashPassword('password'),
        authenticate('jwt'),
      ),
      // FIXME: What are these 0 and 1 keys?
      discard('0', '1'),
      stringifyVerifyChanges,
    ],
    remove: [
      authenticate('jwt'),
      verifySelf,
      statusSoftDelete,
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
    create: [
      niceUniqueConstraintError('username', 'Username'),
      niceUniqueConstraintError('email', 'Email'),
    ],
    update: [],
    patch: [
      niceUniqueConstraintError('username', 'Username'),
      niceUniqueConstraintError('email', 'Email'),
    ],
    remove: [],
  },
};
