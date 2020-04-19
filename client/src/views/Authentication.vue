<template>
  <div class="home">
    <h1>Todo Collab</h1>
    <p v-if="user.email">
      Logged in as: {{ user.email }}
    </p>
    <div v-else>
      <login></login>
      <register></register>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import store from '../store';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

export default {
  name: 'authentication',
  components: {
    Login,
    Register,
  },
  setup() {
    const { state } = store;
    const user = computed(() => state.user);

    return {
      user,
    };
  },
};
</script>
