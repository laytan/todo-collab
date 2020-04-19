<template>
  <div id="app">
    <router-view/>
    <div class="loading-spinner">
      <i class="material-icons" v-if="loading">autorenew</i>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from 'vue';
import types from './types';
import store from './store';

export default {
  setup() {
    const { state, dispatch } = store;

    const loading = computed(() => state.loading);
    const user = computed(() => state.user);

    function onLogin() {
      dispatch(types.INIT);
      dispatch(types.SYNC_LISTS);
    }

    onMounted(async () => {
      if (!user.id) {
        const loggedIn = await dispatch(types.TRY_AUTH);
        if (loggedIn) {
          onLogin();
        }
      } else {
        onLogin();
      }
    });

    return {
      loading,
    };
  },
};
</script>
<style lang="scss">
.loading-spinner {
  position: fixed;
  right: 10px;
  bottom: 5px;

  i {
    animation: rotation 1s infinite linear;
  }
}

@keyframes rotation {
  from {
      transform: rotate(0deg);
  }
  to {
      transform: rotate(359deg);
  }
}

.red-border {
  background-color: rgba(0,0,0,0);
  border: #f44336 2px solid;

  &:hover, &:focus {
    background-color: #f44336;
  }
}

.flex {
  display: flex;

  &.between {
    justify-content: space-between;
  }

  &.column {
    flex-direction: column;
  }
}

.m-0 {
  margin: 0;
}
</style>
