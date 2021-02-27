export function todos({ feathers }) {
  const { apiClient, apiVuex } = feathers;
  const { BaseModel, makeServicePlugin } = apiVuex;

  class Todo extends BaseModel {
    static modelName = 'Todo';

    static instanceDefaults() {
      return {
        label: '',
        color: '#0000ff',
        completed: false,
      };
    }
  }

  const servicePath = 'todos';
  const vuexPlugin = makeServicePlugin({
    Model: Todo,
    service: apiClient.service(servicePath),
    servicePath,
  });

  apiClient.service(servicePath).hooks({});

  return vuexPlugin;
}
