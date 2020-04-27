const app = require('../../src/app');

describe('\'user_has_access\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-has-access');
    expect(service).toBeTruthy();
  });
});
