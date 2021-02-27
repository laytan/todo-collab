export function userHasAccess({ feathers }) {
  const { apiClient, apiVuex } = feathers;
  const { BaseModel, makeServicePlugin } = apiVuex;

  class UserHasAccess extends BaseModel {
    static modelName = 'UserHasAccess';
  }

  const servicePath = 'user_has_access';
  const vuexPlugin = makeServicePlugin({
    Model: UserHasAccess,
    service: apiClient.service(servicePath),
    servicePath,
  });

  apiClient.service(servicePath).hooks({});

  return vuexPlugin;
}
