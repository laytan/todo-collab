const axios = require('axios');
const cheerio = require('cheerio');
const app = require('../src/app');
const { getPort, getUrl } = require('./helpers')(app);

let server;
beforeAll((done) => {
  server = app.listen(getPort());
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
  it('shows the readme when getting /', async (done) => {
    const { data } = await axios.get(getUrl());
    const $ = cheerio.load(data);
    expect($('.back').length).toBe(1);
    done();
  });

  it('has working links to deeper pages', async (done) => {
    const { data } = await axios.get(getUrl());
    let $ = cheerio.load(data);
    const firstUrlNotBack = $('a:not(.back)').attr('href');
    const { data: firstUrlData } = await axios.get(getUrl(firstUrlNotBack));
    $ = cheerio.load(firstUrlData);
    expect($('.back').length).toBeTruthy();
    done();
  });
});
