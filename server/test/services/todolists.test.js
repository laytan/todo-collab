const app = require('../../src/app');

describe('\'todolists\' service', () => {
  it('registered the service', () => {
    const service = app.service('todo-lists');
    expect(service).toBeTruthy();
  });
});
