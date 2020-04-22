<template>
  <div id="app">
    <router-view />
    <div class="loading-spinner">
      <i class="material-icons" v-if="loading">autorenew</i>
    </div>
  </div>
</template>
<script>
import { onMounted } from 'vue';

import { mapState, useStore } from '@/store';
import { actions } from '@/types';

export default {
  setup() {
    const { dispatch } = useStore();
    const [loading, user] = mapState(['loading', 'user']);

    function onLogin() {
      dispatch(actions.INIT);
      dispatch(actions.SYNC_LISTS);
    }

    onMounted(async () => {
      if (!user.id) {
        const loggedIn = await dispatch(actions.TRY_AUTH);
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
