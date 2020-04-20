import { actions, mutations } from '@/types';
import { services } from '@/feathers';

export default {
  mutations: {
    [mutations.UPDATE_ITEM](state, item) {
      state.lists.forEach((list) => {
        if (list._id !== item.listId) {
          return;
        }

        const newItems = list.items.filter((listItem) => item._id !== listItem._id);
        list.items = newItems;
        list.items.push(item);
      });
    },
  },
  actions: {
    async [actions.PATCH_ITEM]({ commit }, { id, patchData }) {
      commit(mutations.SET_LOADING, true);
      await services.todos.patch(id, patchData);
      commit(mutations.SET_LOADING, false);
    },
  },
};
