<template>
  <div>
    <navigation />
    <div class="container px-2 mx-auto mt-4">
      <h2 class="mb-3 text-5xl text-red-400">Your accessable lists</h2>
      <div class="grid grid-cols-3 gap-8">
        <div class="p-2 text-white bg-gray-800 rounded shadow" v-for="list in lists" :key="list.id">
          <h3 class="pb-2 text-2xl border-b border-red-400">{{ list.name }}</h3>
          <p class="mb-2">{{ list.description }}</p>
          <Button>
            <router-link class="hover:no-underline" :to="{ name: 'list', params: { id: list.id } }">
              To List
            </router-link>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { models, useFind } from '@feathersjs/vuex';

import { mustBeLoggedIn } from '@/helpers';

import Navigation from '@/components/Navigation.vue';
import Button from '@/components/Button.vue';

export default {
  components: {
    Navigation,
    Button,
  },
  setup() {
    onMounted(mustBeLoggedIn);
    const { List } = models.api;
    const { items: lists } = useFind({
      model: List,
      params: {},
    });
    return { lists };
  },
};
</script>
