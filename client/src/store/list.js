import { actions, mutations } from '@/types';
import { services } from '@/feathers';

export default {
  mutations: {
    [mutations.ADD_LIST](state, list) {
      state.lists.push(list);
    },
    [mutations.REMOVE_LIST](state, list) {
      state.lists = state.lists.filter((sList) => sList.id !== list.id);
    },
    [mutations.ADD_ITEM_TO_LIST](state, item) {
      state.lists.forEach((list) => {
        if (list.id !== item.listId) {
          return;
        }

        list.items.push(item);
      });
    },
  },
  actions: {
    [actions.ADD_LIST]({ commit }, { name, description, password }) {
      commit(mutations.SET_LOADING, true);
      return services.todolists.create({ name, description, password })
        .finally(() => commit(mutations.SET_LOADING, false));
    },
    async [actions.ADD_ITEM_TO_LIST]({ commit }, listId) {
      commit(mutations.SET_LOADING, true);
      await services.todos.create({
        list_id: listId,
        name: 'Write your to-do here',
        description: 'Write your description here',
      });
      // commit(ADD_ITEM_TO_CURRENT_LIST, item);
      commit(mutations.SET_LOADING, false);
      // return item;
    },
    async [actions.SYNC_LISTS]({ commit }) {
      commit(mutations.SET_LOADING, true);
      const lists = await services.todolists.find();
      lists.forEach((list) => commit(mutations.ADD_LIST, list));
      commit(mutations.SET_LOADING, false);
    },
  },
};
