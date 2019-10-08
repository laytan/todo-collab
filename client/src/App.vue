<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { useState, useActions } from '@u3u/vue-hooks';
import { onMounted } from '@vue/composition-api';
import types from './types';

export default {
  setup() {
    const { TRY_AUTH } = useActions([types.TRY_AUTH]);
    const { user } = useState(['user']);

    onMounted(async () => {
      if (!user.id) {
        TRY_AUTH();
      }
    });
  },
};
</script>
<style lang="scss">
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
