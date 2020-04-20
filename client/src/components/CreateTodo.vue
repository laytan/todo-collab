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
import { reactive, ref } from 'vue';

import { useStore, mapState } from '@/store';
import { actions } from '@/types';

export default {
  setup() {
    const { dispatch } = useStore();

    const user = mapState('user');

    const todo = reactive({
      name: '',
      description: '',
      password: '',
    });

    const createdTodo = ref({});

    async function create() {
      const res = await dispatch(actions.ADD_LIST, {
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
