import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';

const socket = io('http://localhost:3030');
export const client = feathers();

client.configure(socketio(socket));
client.configure(auth());

export const services = {
  users: client.service('users'),
  todolists: client.service('todolists'),
  todos: client.service('todos'),
};
