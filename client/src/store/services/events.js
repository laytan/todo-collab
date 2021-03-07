export function events({ feathers }) {
  const { apiClient, apiVuex } = feathers;
  const { BaseModel, makeServicePlugin } = apiVuex;

  class Event extends BaseModel {
    static modelName = 'Event';
  }

  const servicePath = 'events';
  const vuexPlugin = makeServicePlugin({
    Model: Event,
    service: apiClient.service(servicePath),
    servicePath,
  });

  apiClient.service(servicePath).hooks({});

  return vuexPlugin;
}
