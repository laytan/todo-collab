// Sets the logged in user id as column
const setUserId = (column) => (context) => {
  context.data[column] = context.params.user.id;
};

const addAccessForOwner = (context) => context.app.service('user-has-access').create({
  user_id: context.result.owner_id,
  list_id: context.result.id,
}).then(() => context).catch((e) => e);

/**
 * Enforce a unique contraint, col can be null
 */
const unique = (table, column, errorMsg) => async (context) => {
  const check = context.data[column];
  if (!check) {
    return context;
  }

  const query = {};
  query[column] = check;
  const results = await context.app.service(table).find({ query });
  if (results.data.length > 0) {
    throw new Error(errorMsg);
  }

  return context;
};

const stringifyVerifyChanges = (context) => {
  if (context.data.verifyChanges) {
    context.data.verifyChanges = JSON.stringify(context.data.verifyChanges);
  }
  return context;
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

/**
 * Makes sure populate hook output is an array.
 *
 * Populate normally return null on no items and an object on 1 item.
 *
 * Types: GET, FIND
 */
const convertPopulateOutputToArr = (column) => (context) => {
  const convert = (record) => {
    if (!Array.isArray(record[column])) {
      if (record[column] === null || record[column] === undefined) {
        record[column] = [];
      } else {
        record[column] = [record[column]];
      }
    }
    return record;
  };

  if (Array.isArray(context.result)) {
    context.result = context.result.map(convert);
    return context;
  }

  context.result = convert(context.result);
  return context;
};

// Converts completed boolean into done_by and completed_at
const convertCompleted = (context) => {
  if (context.data.completed !== undefined) {
    const { completed } = context.data;
    delete context.data.completed;

    if (completed) {
      context.data.done_by_user_id = context.params.user.id;
      context.data.completed_at = new Date();
    } else {
      context.data.done_by_user_id = null;
      context.data.completed_at = null;
    }
  }

  return context;
};


module.exports = {
  setUserId,
  addAccessForOwner,
  unique,
  stringifyVerifyChanges,
  logRequest,
  logResult,
  convertPopulateOutputToArr,
  convertCompleted,
};
