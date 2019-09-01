<template>
  <div class="home">
    <h1>Todo Collab</h1>
    <div v-if="user.email">
      <h2>Create a todo!</h2>
      <create-todo></create-todo>
    </div>
  </div>
</template>

<script>
import { useState } from '@u3u/vue-hooks';
import CreateTodo from '../components/CreateTodo.vue';

export default {
  name: 'home',
  components: {
    CreateTodo,
  },
  setup() {
    const { user } = useState(['user']);

    return {
      user,
    };
  },
};
</script>
