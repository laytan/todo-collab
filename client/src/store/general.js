import { mutations } from '@/types';

export default {
  mutations: {
    [mutations.SET_LOADING](state, loading) {
      state.loading = loading;
    },
  },
  actions: {},
};
