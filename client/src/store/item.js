import { actions, mutations } from '@/types';
import { services } from '@/feathers';

export default {
  mutations: {
    [mutations.UPDATE_ITEM](state, item) {
      state.lists.forEach((list) => {
        if (list.id !== item.listId) {
          return;
        }

        const newItems = list.items.filter((listItem) => item.id !== listItem.id);
        list.items = newItems;
        list.items.push(item);
      });
    },
  },
  actions: {
    [actions.PATCH_ITEM]({ commit }, { id, patchData }) {
      commit(mutations.SET_LOADING, true);
      return services.todos.patch(id, patchData)
        .catch(console.error)
        .finally(() => { commit(mutations.SET_LOADING, false); });
    },
  },
};
