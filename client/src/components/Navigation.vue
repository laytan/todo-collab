<template>
  <div>
    <nav id="nav" class="navigation red">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo">Todo Collab</a>
        <ul class="right">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/about">About</router-link>
          </li>
          <li v-show="user.email">
            <a class="dropdown-trigger" href="#" data-target="account-dropdown">
              {{ user.email }}
              <i class="material-icons right">arrow_drop_down</i>
            </a>
            <ul id="account-dropdown" class="dropdown-content" tabindex="0">
              <li tabindex="0">
                <a href="#" @click="logout">Logout</a>
              </li>
            </ul>
          </li>
          <li v-if="!user.email">
            <router-link to="/authentication">Authenticate</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
import { onMounted } from '@vue/composition-api';
import { useState, useActions } from '@u3u/vue-hooks';
import types from '../types';

export default {
  setup() {
    const { user } = useState(['user']);
    const { LOGOUT, TRY_AUTH } = useActions([types.LOGOUT, types.TRY_AUTH]);

    function logout() {
      LOGOUT();
    }

    onMounted(() => {
      TRY_AUTH();
      window.$('.dropdown-trigger').dropdown();
    });

    return {
      user,
      logout,
    };
  },
};
</script>
<style lang="scss">
.brand-logo {
  margin-left: 1rem;
}
</style>
