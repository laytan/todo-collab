import { computed } from 'vue';
import { createStore, useStore } from 'vuex';

import general from '@/store/general';

import { lists } from '@/store/services/lists';
import { todos } from '@/store/services/todos';
import { userHasAccess } from '@/store/services/user-has-access';
import { users } from '@/store/services/users';
import { auth } from '@/store/auth';

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

export function setupStore({ feathers }) {
  const store = createStore({
    state() {
      return {
        loading: false,
      };
    },
    ...mergedStores([general]),
    plugins: [
      auth({ feathers }),
      lists({ feathers }),
      todos({ feathers }),
      userHasAccess({ feathers }),
      users({ feathers }),
    ],
  });

  return store;
}

export function mapState(states) {
  const store = useStore();

  const mappedState = [];
  const arrayStates = Array.isArray(states) ? states : [states];

  arrayStates.forEach((state) => {
    if (state.includes('.')) {
      mappedState.push(computed(() => {
        const parts = state.split('.').reverse();
        let stateToMap = store.state;
        while (parts.length) {
          const part = parts.pop();
          stateToMap = stateToMap[part];
        }
        return stateToMap;
      }));
      return;
    }

    mappedState.push(computed(() => store.state[state]));
  });

  return mappedState.length > 1 ? mappedState : mappedState[0];
}
