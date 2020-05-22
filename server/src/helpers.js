const { checkContext } = require('feathers-hooks-common');

// Extract ids effected from default locations per method
const getIdsEffected = (context, idField = 'id') => {
  // Don't find on before
  if (context.type === 'before') {
    checkContext(context, 'before', ['create', 'get', 'update', 'patch', 'delete'], 'getIdsEffected');
  }

  let idsEffected = [];
  if (['get', 'remove', 'update', 'patch'].includes(context.method)) {
    if (idField !== 'id') {
      idsEffected = [context.data[idField]];
    }
    idsEffected = [context.id];
  } else if (context.method === 'create') {
    if (context.type === 'after') {
      idsEffected = [context.result[idField]];
    } else {
      idsEffected = [context.data[idField]];
    }
  } else {
    // find
    const result = context.result.data || context.result;
    idsEffected = result.map((res) => res[idField]);
  }
  idsEffected.filter((id) => !!id);
  return idsEffected;
};

/**
 * Specify a default function to run on all id's effected and optionally override it per method
 *
 * @param {Object} context Hook context
 * @param {Function} defaultHandler Function that is passed an id and returns the desired value
 * @param {Object} specificHandlers Object of functions per method to override the defaultHandler
 */
const dependsOnMethod = async (context, defaultHandler, idField = 'id', specificHandlers = {}) => {
  const ids = getIdsEffected(context, idField);

  const handlers = ['create', 'get', 'find', 'update', 'patch', 'remove'].reduce((aggr, handler) => {
    aggr[handler] = specificHandlers[handler] || defaultHandler;
    return aggr;
  }, {});

  return Promise.all(ids.map(handlers[context.method]));
};

/**
 * Returns an array of lists id's the user has access to
 *
 * @param {String} userId User to get lists of
 * @param {} app The Feathers app object
 *
 * @returns {Promise<Array<String>>}
 */
const getAccessibleLists = async (userId, app) => {
  const accessObjects = await app.service('user-has-access').find({ paginate: false, query: { user_id: userId, $select: ['list_id'] } });
  const accessableListIds = accessObjects.map((accessObject) => accessObject.list_id.toString());
  return accessableListIds;
};

module.exports = { dependsOnMethod, getIdsEffected, getAccessibleLists };
