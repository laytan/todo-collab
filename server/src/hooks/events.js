const methodToType = new Map([['find', 'READ'], ['get', 'READ'], ['create', 'CREATE'], ['update', 'UPDATE'], ['patch', 'UPDATE'], ['remove', 'DELETE']]);
function methodToEventType(method) {
  return methodToType.get(method);
}

// Add everything
const dShouldAdd = () => true;

// Emitter is user id
const dGetEmitter = ({ params: { user: { id } } }) => id;

// Use CRUD types
const dGetType = ({ method }) => methodToEventType(method);

// Extract ids effected from default locations per method
const dGetIdsEffected = (context) => {
  let idsEffected = [];
  if (['get', 'remove', 'update', 'patch'].includes(context.method)) {
    idsEffected = [context.id];
  } else if (context.method === 'create') {
    idsEffected = [context.result.id];
  } else {
    // find
    idsEffected = context.result.map((res) => res.id);
  }
  idsEffected.filter((id) => !!id);
  return idsEffected;
};

const registerEvent = ({
  types = [],
  shouldAdd = dShouldAdd,
  getEmitterId = dGetEmitter,
  getType = dGetType,
  getIdsEffected = dGetIdsEffected,
}) => async (context) => {
  // Return on internal calls
  if (!(context.params || {}).provider) {
    return context;
  }

  if (!shouldAdd(context)) {
    return context;
  }

  const emitterId = getEmitterId(context);
  const type = getType(context);


  // Only run on types specified
  if (types.length > 0) {
    if (!types.includes(type)) {
      return context;
    }
  }

  const idsEffected = getIdsEffected(context);
  const service = context.path;

  const eventsToCreate = idsEffected.map((effectedId) => context.app.service('events').create({
    type,
    service,
    id_in_service: effectedId,
    emitter_id: emitterId,
  }));

  await Promise.all(eventsToCreate);

  return context;
};

module.exports = {
  registerEvent, dGetType, dGetEmitter, dGetIdsEffected,
};
