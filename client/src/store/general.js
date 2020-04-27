import { actions, mutations } from '@/types';
import { services } from '@/feathers';

export default {
  mutations: {
    [mutations.SET_INITIALIZED](state) {
      state.isInitialized = true;
    },
    [mutations.SET_LOADING](state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    [actions.INIT]({ state, commit }) {
      if (state.isInitialized) {
        return;
      }

      services.todolists.on('created', (data) => {
        commit(mutations.ADD_LIST, data);
      });

      const onUpdateList = (data) => {
        commit(mutations.REMOVE_LIST, data);
        commit(mutations.ADD_LIST, data);
      };
      services.todolists.on('updated', onUpdateList);
      services.todolists.on('patched', onUpdateList);

      services.todos.on('created', (data) => {
        commit(mutations.ADD_ITEM_TO_LIST, data);
      });

      const onUpdateItem = (data) => {
        commit(mutations.UPDATE_ITEM, data);
      };
      services.todos.on('updated', onUpdateItem);
      services.todos.on('patched', onUpdateItem);

      commit(mutations.SET_INITIALIZED);
    },
  },
};
