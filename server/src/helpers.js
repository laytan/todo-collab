const { BadRequest } = require('@feathersjs/errors');

// Extract ids effected from default locations per method
const getIdsEffected = (context, idField = 'id') => {
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
    if (context.type === 'before') {
      throw new BadRequest('Can not get ID\'s effected on find in before hook.');
    }
  }
  idsEffected.filter((id) => !!id);
  return idsEffected;
};

/**
 * @param {Object} context Hook context
 * @param {Function} defaultHandler Function that is passed an id and returns the desired value
 * @param {Object} specificHandlers Object of functions per method to override the defaultHandler
 */
const dependsOnMethod = async (context, defaultHandler, idField = 'id', specificHandlers) => {
  const ids = getIdsEffected(context, idField);
  const handlers = ['create', 'get', 'find', 'update', 'patch', 'remove'].map((handler) => specificHandlers[handler] || defaultHandler);
  return Promise.all(ids.map(handlers[context.method]));
};

module.exports = { dependsOnMethod, getIdsEffected };
