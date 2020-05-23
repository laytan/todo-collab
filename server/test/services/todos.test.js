const app = require('../../src/app');
const {
  getPort, createUserAndAuthenticate, createList, authenticatedRequest,
} = require('../helpers')(app);

let server;
beforeAll((done) => {
  server = app.listen(getPort());
  server.once('listening', () => done());
});

afterAll((done) => {
  server.close(done);
});

describe('\'todos\' service', () => {
  it('registered the service', () => {
    const service = app.service('todos');
    expect(service).toBeTruthy();
  });

  it('Does not fail validation for a hex of 6 characters', async (done) => {
    const { accessToken } = await createUserAndAuthenticate();
    const list = await createList(accessToken);
    const data = {
      list_id: list.id,
      name: 'test',
      description: 'test',
      label: 'test',
      color: '#ffffff',
      order: 0,
    };

    authenticatedRequest('/todos', data, accessToken)
      .then(({ data: todo }) => {
        expect(todo.color).toBe('#ffffff');
      })
      .catch((e) => {
        done.fail(e);
      })
      .finally(done);
  });
});
