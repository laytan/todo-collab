import Vue from 'vue';
import Vuex from 'vuex';
import types from './types';
import { services, client } from './feathers';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loading: false,
  },
  mutations: {
    [types.SET_USER](state, user) {
      state.user = user;
    },
    [types.SET_LOADING](state, loading) {
      state.loading = loading;
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
      client.reAuthenticate()
        .then((res) => {
          commit(types.SET_USER, res.user);
        })
        .catch(() => {
          commit(types.SET_USER, {});
        });
    },
  },
});
