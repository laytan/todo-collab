import { mutations, actions } from '@/types';
import { services, client } from '@/feathers';

export default {
  mutations: {
    [mutations.SET_USER](state, user) {
      state.user = user;
    },
  },
  actions: {
    async [actions.REGISTER]({ commit }, user) {
      commit(mutations.SET_LOADING, true);
      const res = await services.users.create(user);
      commit(mutations.SET_USER, res);
      commit(mutations.SET_LOADING, false);
    },
    async [actions.LOGIN_WITH_CREDENTIALS]({ commit }, user) {
      try {
        commit(mutations.SET_LOADING, true);
        const res = await client.authenticate({ strategy: 'local', ...user });
        commit(mutations.SET_USER, res.user);
        commit(mutations.SET_LOADING, false);
        return { error: null, user: res };
      } catch (error) {
        return { error, user: null };
      }
    },
    [actions.LOGOUT]({ commit }) {
      commit(mutations.SET_USER, {});
      client.logout();
    },
    [actions.TRY_AUTH]({ commit }) {
      console.log('Trying authentication');
      return client.reAuthenticate()
        .then((res) => {
          console.log('Authentication succeeded');
          commit(mutations.SET_USER, res.user);
          return true;
        })
        .catch(() => {
          console.log('Authentication failed');
          commit(mutations.SET_USER, {});
          return false;
        });
    },
  },
};
