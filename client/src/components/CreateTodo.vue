<template>
  <div class="create-todo">
    <form @submit.prevent="create">
      <input type="text" v-model="todo.name" placeholder="Name">
      <input type="textarea" v-model="todo.description" placeholder="Description">
      <input type="password" v-model="todo.password" placeholder="Password">
      <input type="submit" value="Create">
    </form>
    <div v-if="createdTodo.name">
      <p>Todolist {{ createdTodo.name }} has been created!</p>
      <router-link :to="{ name: 'list', params: { id: createdTodo._id }}">Link</router-link>
      <p>Give this link and the password to your friends / collegues for them to join! </p>
    </div>
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue';
import types from '../types';
import store from '../store';

export default {
  setup() {
    const { state, dispatch } = store;

    const user = computed(() => state.user);

    const todo = reactive({
      name: '',
      description: '',
      password: '',
    });

    const createdTodo = ref({});

    async function create() {
      const res = await dispatch(types.ADD_LIST, {
        name: todo.name,
        description: todo.description,
        password: todo.password,
        access: [
          user.value.email,
        ],
      });
      console.log(res);
      createdTodo.value = res;
    }

    return {
      todo,
      createdTodo,
      create,
    };
  },
};
</script>

<style lang="scss">

</style>
