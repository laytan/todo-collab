const axios = require('axios');
const url = require('url');
const app = require('../src/app');

const port = app.get('port') || 8998;
const getUrl = (pathname) => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname,
});

describe('Feathers application tests (with jest)', () => {
  let server;

  it('completes a base test', () => {
    expect(1 + 1).toBe(2);
  });

  beforeAll((done) => {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  it('sets up the db', async () => {
    expect(app.get('knexClient')).toBeTruthy();
  });

  it('starts and shows the index page', async () => {
    expect.assertions(1);

    const { data } = await axios.get(getUrl());

    expect(data.indexOf('<html lang="en">')).not.toBe(-1);
  });
});
