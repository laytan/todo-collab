import { actions, mutations } from '@/types';
import { services } from '@/feathers';

export default {
  mutations: {
    [mutations.ADD_LIST](state, list) {
      state.lists.push(list);
    },
    [mutations.REMOVE_LIST](state, list) {
      state.lists = state.lists.filter((sList) => sList._id !== list._id);
    },
    [mutations.ADD_ITEM_TO_LIST](state, item) {
      state.lists.forEach((list) => {
        if (list._id !== item.listId) {
          return;
        }

        list.items.push(item);
      });
    },
  },
  actions: {
    async [actions.ADD_LIST]({ commit }, listData) {
      commit(mutations.SET_LOADING, true);
      const res = await services.todolists.create(listData);
      commit(mutations.SET_LOADING, false);
      // TODO: error handling
      console.log(res);
      // commit(ADD_LIST, res);
      return res;
    },
    async [actions.ADD_ITEM_TO_LIST]({ commit }, listId) {
      commit(mutations.SET_LOADING, true);
      await services.todos.create({
        listId,
        order: 0,
        name: 'Write your to-do here',
        label: '',
        description: '',
        color: 'rgba(0,0,0,1)',
        createdAt: Date.now(),
        lastEditedAt: Date.now(),
        doneAt: Date.now(),
        doneBy: '',
        done: false,
      });
      // commit(ADD_ITEM_TO_CURRENT_LIST, item);
      commit(mutations.SET_LOADING, false);
      // return item;
    },
    async [actions.SYNC_LISTS]({ commit }) {
      commit(mutations.SET_LOADING, true);
      const lists = await services.todolists.find();
      lists.data.forEach((list) => commit(mutations.ADD_LIST, list));
      commit(mutations.SET_LOADING, false);
    },
  },
};
