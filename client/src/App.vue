<template>
  <div id="app">
    <router-view/>
    <div class="loading-spinner">
      <i class="material-icons" v-if="loading">autorenew</i>
    </div>
  </div>
</template>
<script>
import { useState, useActions } from '@u3u/vue-hooks';
import { onMounted } from '@vue/composition-api';
import types from './types';

export default {
  setup() {
    const { TRY_AUTH } = useActions([types.TRY_AUTH]);
    const { user, loading } = useState(['user', 'loading']);

    onMounted(async () => {
      if (!user.id) {
        TRY_AUTH();
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
