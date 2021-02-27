export function users({ feathers }) {
  const { apiClient, apiVuex } = feathers;
  const { BaseModel, makeServicePlugin } = apiVuex;

  class User extends BaseModel {
    static modelName = 'User';
  }

  const servicePath = 'users';
  const vuexPlugin = makeServicePlugin({
    Model: User,
    service: apiClient.service(servicePath),
    servicePath,
  });

  apiClient.service(servicePath).hooks({});

  return vuexPlugin;
}
