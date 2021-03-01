export function lists({ feathers }) {
  const { apiClient, apiVuex } = feathers;
  const { BaseModel, makeServicePlugin } = apiVuex;

  class List extends BaseModel {
    static modelName = 'List';
  }

  const servicePath = 'todo-lists';
  const vuexPlugin = makeServicePlugin({
    Model: List,
    service: apiClient.service(servicePath),
    servicePath,
  });

  apiClient.service(servicePath).hooks({});

  return vuexPlugin;
}
