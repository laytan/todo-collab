<template>
  <div id="app">
    <router-view />
    <div class="loading-spinner" v-if="loading">
      <i class="material-icons">autorenew</i>
    </div>
  </div>
</template>
<script>
import { mapState } from '@/store';

export default {
  setup() {
    const loading = mapState('loading');

    return {
      loading,
    };
  },
};
</script>
