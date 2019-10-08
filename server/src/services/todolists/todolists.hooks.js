const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const verifyOwner = async context => {
  // Verify ownership
  context.params.query.author = context.params.user.email;
  return context;
};

const verifyAccess = async context => {
  context.params.query.access = {
    // verify that the email of the user has to be in the access array
    $in: [context.params.user.email],
  };
  return context;
};

const addExistingAccess = async context => {
  // If we want to add to access
  if (context.data.access) {
    // Get the user out of the context to pass along with the internal call
    const { user } = context.params;
    // Get the list we are trying to patch
    return context.app.service('todolists').get(context.id, { query: {}, user })
      .then(list => {
        // Push the access we got from the request onto the existing access
        const access = list.access;
        access.push(context.data.access);
        // Update the context
        context.data.access = access;
        return context;
      });
  } else {
    return context;
  }
};

const revokeAccess = async context => {
  if (context.data.revoke) {
    // Get the user out of the context to pass along with the internal call
    const { user } = context.params;
    // Get the list we are trying to patch
    return context.app.service('todolists').get(context.id, { query: {}, user })
      .then(list => {
        // Push the access we got from the request onto the existing access
        const access = list.access;

        // Check if the email to revoke is in the array
        const toRemove = context.data.revoke;
        const index = access.indexOf(toRemove);
        if (index > -1) {
          // Splice it out of the array
          access.splice(index, 1);
        }

        // Update the context
        context.data.access = access;
        // Remove revoke because we don't actually want to store that
        delete context.data.revoke;
        return context;
      });
  } else {
    return context;
  }
};

// Merges the todos of this list into an array called items on the result
const addItemsArray = async context => {
  const listId = context.result._id;
  return context.app.service('todos').find({ query: { listId } }).then(items => {
    context.result.items = items.data;
    return context;
  });
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [verifyAccess],
    get: [verifyAccess],
    create: [hashPassword('password')],
    update: [verifyOwner, hashPassword('password')],
    patch: [verifyOwner, addExistingAccess, revokeAccess, hashPassword('password')],
    remove: [verifyOwner]
  },

  after: {
    all: [protect('password')],
    find: [],
    get: [addItemsArray],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
