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
import { useState, useActions } from '@u3u/vue-hooks';
import types from '../types';

export default {
  setup() {
    const { ADD_LIST } = useActions([types.ADD_LIST]);

    const state = reactive({
      name: '',
      description: '',
      password: '',
      createdTodo: {},
    });

    const { user } = useState(['user']);

    async function create() {
      const res = await ADD_LIST({
        name: state.name,
        description: state.description,
        password: state.password,
        access: [
          user.value.email,
        ],
      });
      console.log(res);
      state.createdTodo = res;
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
