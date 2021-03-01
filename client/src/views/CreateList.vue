<template>
  <div class="h-screen">
    <navigation />
    <div class="container flex items-center h-full max-w-lg px-2 mx-auto">
      <form @submit.prevent="onSubmit">
        <h1 class="mb-4 text-5xl text-red-400">Create List</h1>
        <label for="name">Name</label>
        <input v-model="list.name" type="text" name="name" id="name" />
        <label for="description">Description</label>
        <textarea v-model="list.description" name="description" id="description" cols="30" rows="5">
        </textarea>
        <Button type="submit">Create</Button>
      </form>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { models } from '@feathersjs/vuex';

import { mustBeLoggedIn } from '@/helpers';

import Navigation from '@/components/Navigation.vue';
import Button from '@/components/Button.vue';

export default {
  name: 'create-list',
  components: {
    Navigation,
    Button,
  },
  setup() {
    onMounted(mustBeLoggedIn);

    const { List } = models.api;

    const list = reactive({
      name: '',
      description: '',
    });

    async function onSubmit() {
      await new List(list).save();
    }

    return { list, onSubmit };
  },
};
</script>
