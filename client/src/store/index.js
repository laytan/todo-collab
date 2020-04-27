import { createStore } from 'vuex';
import { computed } from 'vue';

import auth from '@/store/auth';
import general from '@/store/general';
import item from '@/store/item';
import list from '@/store/list';

/**
 * Merges seperate mutations and actions objects into one
 *
 * @param {[{ mutations: {}, actions: {} }]} stores
 */
function mergedStores(stores) {
  return stores.reduce((aggrStores, currStore) => {
    aggrStores.mutations = { ...aggrStores.mutations, ...currStore.mutations };
    aggrStores.actions = { ...aggrStores.actions, ...currStore.actions };
    return aggrStores;
  }, { mutations: {}, actions: {} });
}

export const store = createStore({
  state: {
    user: {},
    loading: false,
    lists: [],
    isInitialized: false,
  },
  ...mergedStores([auth, general, item, list]),
});


export function useStore() {
  return store;
}

export function mapState(states) {
  const mappedState = [];
  const arrayStates = Array.isArray(states) ? states : [states];

  arrayStates.forEach((state) => {
    mappedState.push(computed(() => store.state[state]));
  });

  return mappedState.length > 1 ? mappedState : mappedState[0];
}
