module.exports = function channels(app) {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('login', async (authResult, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (!connection) {
      return;
    }

    // Obtain the logged in user from the connection
    const { user } = connection;

    // Add it to the authenticated user channel
    app.channel('authenticated').join(connection);

    // find all todolists where the user is in the access array
    const authorizedLists = await app.service('todolists').find({
      query: {},
      user,
    });

    // add the user to the lists channel
    authorizedLists.data.forEach((list) => app.channel(`lists/${list._id}`).join(connection));
  });

  app.on('logout', async (authResult, { connection }) => {
    if (!connection) {
      return;
    }

    app.channel('authenticated').leave(connection);
  });

  // Publish all todolists service events only to its list channel
  app.service('todolists').publish((list) => app.channel(`lists/${list._id}`));

  // add all users in access to new lists channel
  app.service('todolists').on('created', (list) => {
    // Returns all current connections that have access to this list
    const { connections } = app.channel(app.channels).filter(
      (connection) => list.access.includes(connection.user.email),
    );

    connections.map((conn) => app.channel(`lists/${list._id}`).join(conn));
  });

  // Make all connections without access leave the channel
  function onUpdateList(list) {
    app.channel(`lists/${list._id}`).leave((conn) => !(list.access.includes(conn.user.email)));
  }
  app.service('todolists').on('updated', onUpdateList);
  app.service('todolists').on('patched', onUpdateList);

  // Make every connection leave this lists channel
  app.service('todolists').on('removed', (list) => {
    app.channel(`lists/${list._id}`).leave(() => true);
  });

  // Publish todo items to the parents list channel
  app.service('todos').publish((todo) => app.channel(`lists/${todo.listId}`));
};
