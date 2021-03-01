<template>
  <nav class="p-3 bg-red-600">
    <div class="container flex items-center justify-between mx-auto">
      <a href="/" class="text-4xl hover:no-underline">Todo Collab</a>
      <ul class="flex gap-4">
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li v-show="user" class="relative">
          <button @click="showDropdown = !showDropdown">
            {{ user?.username ?? '' }}
            <svg
              class="inline-block w-3 h-3"
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M207.029
                 381.476L12.686
                 187.132c-9.373-9.373-9.373-24.569
                 0-33.941l22.667-22.667c9.357-9.357
                 24.522-9.375 33.901-.04L224
                 284.505l154.745-154.021c9.379-9.335
                 24.544-9.317
                 33.901.04l22.667
                 22.667c9.373
                 9.373
                 9.373
                 24.569
                 0
                 33.941L240.971
                 381.476c-9.373
                 9.372-24.569
                 9.372-33.942
                 0z"
              ></path>
            </svg>
          </button>
          <ul v-if="showDropdown" class="absolute p-2 bg-red-600">
            <li>
              <button @click="logout">Logout</button>
            </li>
          </ul>
        </li>
        <li v-if="!user">
          <router-link to="/authentication">Authenticate</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

import { mapState } from '@/store';

export default {
  setup() {
    const { dispatch } = useStore();
    const user = mapState('auth.user');

    const showDropdown = ref(null);

    function logout() {
      dispatch('auth/logout');
    }

    return {
      user,
      logout,
      showDropdown,
    };
  },
};
</script>
<style lang="postcss" scoped>
a,
button {
  @apply text-white hover:underline;
}
</style>
