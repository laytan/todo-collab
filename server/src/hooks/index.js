const { softDelete, checkContext } = require('feathers-hooks-common');
const {
  Forbidden, BadRequest, Conflict, GeneralError,
} = require('@feathersjs/errors');
const { getIdsEffected, dependsOnMethod } = require('../helpers');

/**
 * Type: before
 * Methods: patch and create
 *
 * @param {String} column the column for the id
 */
const setUserId = (column) => (context) => {
  checkContext(context, 'before', ['patch', 'create'], 'setUserId');

  context.data[column] = context.params.user.id;
};

/**
 * Parses a sql error for a duplicate entry error with the find keyword in it
 * and errors as a conflict instead of a general error
 *
 * Type: error
 * Methods: patch and create
 *
 * @param {String} find string which if found in the sql error,
 * identifies this unique constraint violation
 * @param {String} call What name to error with
 */
const niceUniqueConstraintError = (find, call) => (context) => {
  checkContext(context, 'error', ['patch', 'create'], 'niceUniqueConstaintError');

  if (context.error.message.includes(find) && context.error.message.includes('Duplicate entry')) {
    throw new Conflict(`${call} is already in use.`);
  }
};

/**
 * Logs the request
 *
 * Type: before
 * Methods: all
 */
const logRequest = async (context) => {
  checkContext(context, 'before', undefined, 'logRequest');

  // eslint-disable-next-line no-console
  console.log(`[${new Date().toLocaleTimeString()}] ${context.method.toUpperCase()} ${context.path}`);
  return context;
};

/**
 * If the current user does not own any of the ids effected by this request
 * it will reject with a forbidden error
 *
 * Type: before
 * Methods: all but the getIds default can't run on a before find hook
 *
 * @param {String} userIdColumn The column where the id of the owner is
 * @param {Function} getIds A function to get the ids of the rows that should be checked
 */
const verifyOwner = (userIdColumn = 'user_id', getIds = getIdsEffected) => async (context) => {
  checkContext(context, 'before', ['create', 'get', 'patch', 'remove', 'update'], 'verifyOwner');

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
 * Type: before
 * Methods: all but find
 *
 * @param {string} listIdColumn The column name for the id of the list to verify ownership for
 */
const verifyListOwner = (listIdColumn) => async (context) => {
  checkContext(context, 'before', ['create', 'get', 'patch', 'remove', 'update'], 'verifyListOwner');

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
 * Soft delete on status field
 *
 * Type: before
 * Methods: all
 */
const statusSoftDelete = async (context) => {
  checkContext(context, 'before', undefined, 'statusSoftDelete');

  // Remove provider for this call because else the joi schema validation will fail
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
 * Type: before
 * Methods: create and patch
 *
 * @param {Joi} schema Joi schema to validate against
 * @param {boolean} requireAll Set fields to required
 */
const validate = (schema, { requireAll }) => async (context) => {
  checkContext(context, 'before', ['create', 'patch'], 'validate');

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
  logRequest,
  verifyOwner,
  statusSoftDelete,
  verifyListOwner,
  validate,
  niceUniqueConstraintError,
};
