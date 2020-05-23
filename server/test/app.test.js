const axios = require('axios');
const url = require('url');
const cheerio = require('cheerio');
const app = require('../src/app');

const port = app.get('port') || 8998;
const getUrl = (pathname) => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname,
});

let server;
beforeAll((done) => {
  server = app.listen(port);
  server.once('listening', () => done());
});

afterAll((done) => {
  server.close(done);
});

describe('setup', () => {
  it('completes a base test', () => {
    expect(1 + 1).toBe(2);
  });

  it('sets up the db', () => {
    expect(app.get('knexClient')).toBeTruthy();
  });
});

describe('DOCS', () => {
  it('shows the readme when getting /', async () => {
    expect.assertions(1);

    const { data } = await axios.get(getUrl());
    const $ = cheerio.load(data);
    expect($('.back').length).toBeTruthy();
  });

  it('has working links to deeper pages', async () => {
    expect.assertions(1);

    const { data } = await axios.get(getUrl());
    let $ = cheerio.load(data);
    const firstUrlNotBack = $('a:not(.back)').attr('href');
    const { data: firstUrlData } = await axios.get(getUrl(firstUrlNotBack));
    $ = cheerio.load(firstUrlData);
    expect($('.back').length).toBeTruthy();
  });
});
