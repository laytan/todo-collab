import Vue from 'vue';
import Vuex from 'vuex';
import types from './types';
import { services, client } from './feathers';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loading: false,
    lists: [],
    currentList: {},
  },
  mutations: {
    [types.SET_USER](state, user) {
      state.user = user;
    },
    [types.SET_LOADING](state, loading) {
      state.loading = loading;
    },
    [types.ADD_LIST](state, list) {
      state.lists.push(list);
    },
    [types.SET_CURRENT_LIST](state, list) {
      state.currentList = list;
    },
    [types.ADD_ITEM_TO_CURRENT_LIST](state, item) {
      if (state.currentList.items) {
        state.currentList.items.push(item);
      } else {
        state.currentList.items = [item];
      }
    },
    [types.OVERRIDE_TODO](state, newTodo) {
      // Find needed todo to update, update and stop looping
      state.currentList.items.some((v, i) => {
        if (v._id === newTodo._id) {
          state.currentList.items[i] = newTodo;
          return true;
        }
        return false;
      });
    },
  },
  actions: {
    async [types.REGISTER]({ commit }, user) {
      commit(types.SET_LOADING, true);
      const res = await services.users.create(user);
      commit(types.SET_USER, res);
      commit(types.SET_LOADING, false);
    },
    async [types.LOGIN_WITH_CREDENTIALS]({ commit }, user) {
      commit(types.SET_LOADING, true);
      const res = await client.authenticate({ strategy: 'local', ...user });
      commit(types.SET_USER, res.user);
      commit(types.SET_LOADING, false);
    },
    [types.LOGOUT]({ commit }) {
      commit(types.SET_USER, {});
      client.logout();
    },
    [types.TRY_AUTH]({ commit }) {
      console.log('Trying authentication');
      client.reAuthenticate()
        .then((res) => {
          console.log('Authentication succeeded');
          commit(types.SET_USER, res.user);
        })
        .catch(() => {
          console.log('Authentication failed');
          commit(types.SET_USER, {});
        });
    },
    async [types.ADD_LIST]({ commit }, listData) {
      commit(types.SET_LOADING, true);
      const res = await services.todolists.create(listData);
      commit(types.SET_LOADING, false);
      // TODO: error handling
      console.log(res);
      commit(types.ADD_LIST, res);
      return res;
    },
    async [types.SET_CURRENT_LIST]({ commit }, listId) {
      commit(types.SET_LOADING, true);
      const list = await services.todolists.get(listId);
      console.log(list);
      commit(types.SET_CURRENT_LIST, list);
      commit(types.SET_LOADING, false);
      return list;
    },
    async [types.ADD_ITEM_TO_CURRENT_LIST]({ state, commit }) {
      commit(types.SET_LOADING, true);
      const item = await services.todos.create({
        listId: state.currentList._id,
        order: 0,
        name: '',
        label: '',
        description: '',
        color: 'rgba(0,0,0,1)',
        createdAt: Date.now(),
        lastEditedAt: Date.now(),
        doneAt: Date.now(),
        doneBy: '',
        done: false,
      });
      commit(types.ADD_ITEM_TO_CURRENT_LIST, item);
      commit(types.SET_LOADING, false);
      return item;
    },
    async [types.CHANGE_TODO_NAME]({ commit }, { todoId, name }) {
      commit(types.SET_LOADING, true);
      const newTodo = await services.todos.patch(todoId, {
        name,
      });
      commit(types.OVERRIDE_TODO, newTodo);
      commit(types.SET_LOADING, false);
    },
    async [types.CHANGE_TODO_DESCRIPTION]({ commit }, { todoId, description }) {
      commit(types.SET_LOADING, true);
      const newTodo = await services.todos.patch(todoId, {
        description,
      });
      commit(types.OVERRIDE_TODO, newTodo);
      commit(types.SET_LOADING, false);
    },
  },
});
