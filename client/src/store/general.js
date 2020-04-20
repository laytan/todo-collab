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
      console.log('initializing');
      if (state.isInitialized) {
        console.log('already initialized');
        return;
      }

      services.todolists.on('created', (data) => {
        commit(mutations.ADD_LIST, data);
        console.log('created', data);
      });

      const onUpdateList = (data) => {
        commit(mutations.REMOVE_LIST, data);
        commit(mutations.ADD_LIST, data);
        console.log('updated', data);
      };
      services.todolists.on('updated', onUpdateList);
      services.todolists.on('patched', onUpdateList);

      services.todos.on('created', (data) => {
        console.log('created t', data);
        commit(mutations.ADD_ITEM_TO_LIST, data);
      });

      const onUpdateItem = (data) => {
        commit(mutations.UPDATE_ITEM, data);
        console.log('updated t', data);
      };
      services.todos.on('updated', onUpdateItem);
      services.todos.on('patched', onUpdateItem);

      commit(mutations.SET_INITIALIZED);
    },
  },
};
