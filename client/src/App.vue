<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/authentication">Authenticate</router-link> |
      <div v-if="user.email">
        <span>{{ user.email }}</span>
        <a @click="logout">Logout</a>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { onMounted } from '@vue/composition-api';
import { useState, useActions } from '@u3u/vue-hooks';
import types from './types';

export default {
  setup() {
    const { user } = useState(['user']);
    const { LOGOUT, TRY_AUTH } = useActions([types.LOGOUT, types.TRY_AUTH]);

    function logout() {
      LOGOUT();
    }

    onMounted(() => {
      TRY_AUTH();
    });

    return {
      user,
      logout,
    };
  },
};
</script>

<style lang="scss">

</style>
