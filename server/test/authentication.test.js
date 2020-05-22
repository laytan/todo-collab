const app = require('../src/app');

describe('authentication', () => {
  it('registered the authentication service', () => {
    expect(app.service('authentication')).toBeTruthy();
  });

  describe('local strategy', () => {
    const userInfo = {
      username: 'someone',
      email: 'someone@example.com',
      password: 'supersecret',
    };

    beforeAll(async () => {
      await app.service('users').create(userInfo);
    });

    it('authenticates user and creates accessToken', async () => {
      const { user, accessToken } = await app.service('authentication').create({
        strategy: 'local',
        email: userInfo.email,
        password: userInfo.password,
      });

      expect(accessToken).toBeTruthy();
      expect(user).toBeTruthy();
    });
  });
});
