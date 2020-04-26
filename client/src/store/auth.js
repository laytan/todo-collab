import { mutations, actions } from '@/types';
import { services, client } from '@/feathers';

export default {
  mutations: {
    [mutations.SET_USER](state, user) {
      console.log(user);
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
        return { error: null, user: res };
      } catch (error) {
        return { error, user: null };
      } finally {
        commit(mutations.SET_LOADING, false);
      }
    },
    [actions.LOGOUT]({ commit }) {
      commit(mutations.SET_USER, {});
      client.logout();
    },
    [actions.TRY_AUTH]({ commit }) {
      return client.reAuthenticate()
        .then((res) => {
          commit(mutations.SET_USER, res.user);
          return true;
        })
        .catch(() => {
          commit(mutations.SET_USER, {});
          return false;
        });
    },
    async [actions.VERIFY_EMAIL]({ commit }, token) {
      commit(mutations.SET_LOADING, true);
      try {
        const user = await services.authManagement.create({
          action: 'verifySignupLong',
          value: token,
        });
        return { user, error: null };
      } catch (e) {
        return { user: null, error: e.message };
      } finally {
        commit(mutations.SET_LOADING, false);
      }
    },
    [actions.SEND_RESET_PASSWORD](_, email) {
      try {
        services.authManagement.create({
          action: 'sendResetPwd',
          value: { email },
        });
      } catch (e) {
        console.error(e);
      }
    },
    [actions.RESET_PASSWORD](_, { token, password }) {
      try {
        services.authManagement.create({
          action: 'resetPwdLong',
          value: {
            token,
            password,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
