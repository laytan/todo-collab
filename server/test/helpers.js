const url = require('url');
const axios = require('axios');

module.exports = (app) => {
  /**
   * Returns the app port or a default one
   */
  function getPort() {
    return app.get('port') || 8998;
  }

  /**
   * Retrieves full url for the api
   *
   * @param {String} pathname API endpoint to get url for
   */
  const getUrl = (pathname = '') => url.format({
    hostname: app.get('host') || 'localhost',
    protocol: 'http',
    port: getPort(),
    pathname,
  });

  /**
   * Creates a user through the user service and posts to /authentication to get an access token
   *
   * @param {{ username: String, email: String, password: String }} data User data
   */
  async function createUserAndAuthenticate(data = { username: 'test', email: 'test@test.com', password: 'password' }) {
    await app.service('users').create(data);
    return (await axios.post(getUrl('authentication'), { strategy: 'local', email: data.email, password: data.password })).data;
  }

  /**
   * Performs an authenticated request
   *
   * @param {String} endpoint API endpoint
   * @param {*} data Request body
   * @param {String} token JWT token
   */
  async function authenticatedRequest(endpoint, data, token) {
    return axios.post(
      getUrl(endpoint),
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  /**
   * Creates a list by posting to /todo-lists
   *
   * @param {String} token JWT token for authenticated user
   * @param {{ name: String, description: String, password: String }} data Request body
   */
  async function createList(token, data = { name: 'test', description: '', password: 'password' }) {
    return (await authenticatedRequest('/todo-lists', data, token)).data;
  }

  return {
    getPort,
    getUrl,
    createUserAndAuthenticate,
    authenticatedRequest,
    createList,
  };
};
