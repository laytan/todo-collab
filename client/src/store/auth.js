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
    async [actions.SEND_RESET_PASSWORD]({ commit }, email) {
      commit(mutations.SET_LOADING, true);
      try {
        const user = await services.authManagement.create({
          action: 'sendResetPwd',
          value: { email },
        });

        return { user, error: null };
      } catch (e) {
        return { user: null, error: e.message };
      } finally {
        commit(mutations.SET_LOADING, false);
      }
    },
    async [actions.RESET_PASSWORD]({ commit }, { token, password }) {
      commit(mutations.SET_LOADING, true);
      try {
        const user = await services.authManagement.create({
          action: 'resetPwdLong',
          value: {
            token,
            password,
          },
        });

        return { user, error: null };
      } catch (e) {
        return { error: e.message, user: null };
      } finally {
        commit(mutations.SET_LOADING, false);
      }
    },
  },
};
