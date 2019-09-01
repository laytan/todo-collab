<template>
  <div class="create-todo">
    <form @submit.prevent="create">
      <input type="text" v-model="state.name" placeholder="Name">
      <input type="textarea" v-model="state.description" placeholder="Description">
      <input type="password" v-model="state.password" placeholder="Password">
      <input type="submit" value="Create">
    </form>
    <div v-if="state.createdTodo.name">
      <p>Todolist {{ state.createdTodo.name }} has been created!</p>
      <router-link :to="{ name: 'list', params: { id: state.createdTodo._id }}">Link</router-link>
      <p>Give this link and the password to your friends / collegues for them to join! </p>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api';
import { useState } from '@u3u/vue-hooks';
import { services } from '../feathers';

export default {
  setup() {
    const state = reactive({
      name: '',
      description: '',
      password: '',
      createdTodo: {},
    });

    const { user } = useState(['user']);

    async function create() {
      const createdTodo = await services.todolists.create({
        name: state.name,
        description: state.description,
        password: state.password,
        access: [
          user.value.email,
        ],
      });

      state.createdTodo = createdTodo;
    }

    return {
      state,
      create,
    };
  },
};
</script>

<style lang="scss">

</style>
