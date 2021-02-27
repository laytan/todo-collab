<template>
  <div id="app">
    <router-view />
    <div v-if="loading">
      Loading...
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex';

import { mapState } from './store';

export default {
  setup() {
    const { dispatch } = useStore();
    const [loading, user] = mapState(['loading', 'user']);

    // Login when not logged in and we have a jwt token in localstorage
    if (!user.value && localStorage.getItem('feathers-jwt')?.length) {
      dispatch('auth/authenticate').catch(() => {});
    }

    return {
      loading,
    };
  },
};
</script>
