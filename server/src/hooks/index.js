const {
  iff, isProvider, required, softDelete,
} = require('feathers-hooks-common');
const {
  Forbidden, BadRequest, Conflict, GeneralError,
} = require('@feathersjs/errors');
const { getIdsEffected, dependsOnMethod } = require('../helpers');

// Sets the logged in user id as column
const setUserId = (column) => (context) => {
  context.data[column] = context.params.user.id;
};

/**
 * Enforce a unique contraint, col can be null
 */
const unique = (table, column, errorMsg) => async (context) => {
  console.error('deprecated');
  const check = context.data[column];
  if (!check) {
    return context;
  }

  const query = {};
  query[column] = check;
  const results = await context.app.service(table).find({ query });
  if (results.data.length > 0) {
    throw new Conflict(errorMsg);
  }

  return context;
};

const niceUniqueConstraintError = (find, call) => (context) => {
  if (context.error.message.includes(find) && context.error.message.includes('Duplicate entry')) {
    throw new Conflict(`${call} is already in use.`);
  }
};

const logRequest = async (context) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toLocaleTimeString()}] ${context.method.toUpperCase()} ${context.path}`);
  return context;
};

const logResult = (context) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toLocaleTimeString()}] ${context.method.toUpperCase()} ${context.path} Results:`);
  // eslint-disable-next-line no-console
  console.dir(context.result);
  return context;
};


const verifyOwner = (userIdColumn = 'user_id', getIds = getIdsEffected) => async (context) => {
  if (userIdColumn === 'id') {
    throw new GeneralError('VerifyOwner can not be called with userIdColumn = "id"');
  }

  // Get all ids to check on the service
  const ids = getIds(context);

  // Find all the ids where the owner is the user
  const query = {
    paginate: false,
    query: {
      id: { $in: ids },
      [userIdColumn]: context.params.user.id,
    },
  };
  const records = await context.app.service(context.path).find(query);

  // If these are not the same length one or more of the ids are not owned by user
  if (!ids.length === records.length) {
    throw new Forbidden('You do not own these records');
  }

  return context;
};

/**
 * Gets the list id from specified column and checks if the list owner is that id
 *
 * @param {string} listIdColumn The column name for the id of the list to verify ownership for
 */
const verifyListOwner = (listIdColumn) => async (context) => {
  const list = await dependsOnMethod(
    context,
    (listId) => context.app.service('todo-lists').get(listId),
    listIdColumn,
  );

  if (list.owner_id !== context.user.id) {
    throw new Forbidden('You are not the list owner.');
  }

  return context;
};

/**
 * Requires given keys if the provider is external
 *
 * @param  {...any} args required keys
 */
const externalRequires = (...args) => iff(isProvider('external'), required(...args));

/**
 * Soft delete on status field
 */
const statusSoftDelete = async (context) => {
  // Remove provider for this call
  const copyContext = { ...context };
  const { provider } = context.params;
  delete copyContext.params.provider;

  const newContext = await softDelete({
    deletedQuery: () => ({ status: { $ne: 0 } }),
    removeData: () => ({ status: 0 }),
  })(copyContext);

  // Add back provider
  newContext.params.provider = provider;
  return copyContext;
};

/**
 * Validate using Joi
 *
 * @param {Joi} schema Joi schema to validate against
 * @param {boolean} requireAll Set fields to required
 */
const validate = (schema, { requireAll }) => async (context) => {
  if (Object.keys(context.data).length === 0) {
    throw new BadRequest('Empty body not allowed');
  }

  try {
    const options = {
      abortEarly: false,
    };
    if (requireAll) {
      options.presence = 'required';
    }

    await schema.validateAsync(context.data, options);
    return context;
  } catch (e) {
    const errors = e.details.map((err) => ({ [err.context.label]: err.message }));
    throw new BadRequest('Request failed validation.', {
      errors,
    });
  }
};

module.exports = {
  setUserId,
  unique,
  logRequest,
  logResult,
  externalRequires,
  verifyOwner,
  statusSoftDelete,
  verifyListOwner,
  validate,
  niceUniqueConstraintError,
};
