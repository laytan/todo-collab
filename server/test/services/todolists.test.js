const app = require('../../src/app');

describe('\'todolists\' service', () => {
  it('registered the service', () => {
    const service = app.service('todolists');
    expect(service).toBeTruthy();
  });
});
