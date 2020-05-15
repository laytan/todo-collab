/**
 * Channels:
 *
 * authenticated: all the users that are logged in
 * lists/[id]: every list has it's own channel, todos are also published here
 */

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

    // Get all lists the user has access to
    const authorizedLists = await app.service('user-has-access').find({
      query: {
        user_id: user.id,
      },
    });

    // add the user to the lists channel
    authorizedLists.data.forEach((list) => app.channel(`lists/${list.id}`).join(connection));
  });

  app.on('logout', async (authResult, { connection }) => {
    if (!connection) {
      return;
    }

    app.channel('authenticated').leave(connection);
  });

  // Publish all todolists service events only to its list channel
  app.service('todo-lists').publish((list) => app.channel(`lists/${list.id}`));

  // Leave the list's channel when your access has been removed
  app.service('user-has-access').on('removed', (revokedAccess) => {
    app.channel(`lists/${revokedAccess.list_id}`).leave((conn) => conn.user.id === revokedAccess.user_id);
  });

  // Make every connection leave this lists channel
  app.service('todo-lists').on('removed', (list) => {
    app.channel(`lists/${list.id}`).leave(() => true);
  });

  // Publish todo items to the parents list channel
  app.service('todos').publish((todo) => app.channel(`lists/${todo.listId}`));
};
