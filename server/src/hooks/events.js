const helpers = require('../helpers');

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

const registerEvent = ({
  types = [],
  shouldAdd = dShouldAdd,
  getEmitterId = dGetEmitter,
  getType = dGetType,
  getIdsEffected = helpers.getIdsEffected,
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
  registerEvent, dGetType, dGetEmitter,
};
