<template>
  <div id="app">
    <router-view />
    <div v-if="loading || isLoading" class="fixed bottom-0 right-0 m-2">
      Loading...
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex';

import useFeathersLoading from '@/composition/useFeathersLoading';
import { mapState } from './store';

export default {
  setup() {
    const { dispatch } = useStore();
    const [loading, user] = mapState(['loading', 'user']);
    const isLoading = useFeathersLoading([
      'todos',
      'users',
      'user-has-access',
      'events',
      'todo-lists',
    ]);

    // Login when not logged in and we have a jwt token in localstorage
    if (!user.value && localStorage.getItem('feathers-jwt')?.length) {
      dispatch('auth/authenticate').catch(() => {});
    }

    return {
      loading,
      isLoading,
    };
  },
};
</script>
