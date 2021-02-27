import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import { iff, discard } from 'feathers-hooks-common';
import feathersVuex from '@feathersjs/vuex';

export function setupFeathers() {
  // TODO: Extract
  const apiUrl = 'http://localhost:3030';
  const socket = io(apiUrl, { transports: ['websocket'] });

  const apiClient = feathers()
    .configure(socketio(socket))
    .configure(auth())
    .hooks({
      before: {
        all: [
          // Don't send FeathersVuex temp attributes to the server.
          iff(
            (context) => ['create', 'update', 'patch'].includes(context.method),
            discard('__id', '__isTemp'),
          ),
        ],
      },
    });

  // setup feathers-vuex
  const apiVuex = feathersVuex(apiClient, {
    idField: 'id',
    whitelist: ['$regex', '$options'],
  });

  return { apiClient, apiVuex };
}
