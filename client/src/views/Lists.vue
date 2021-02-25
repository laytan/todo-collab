<template>
  <div>
    <navigation />
    <div class="container">
      <h2>Your accessable lists</h2>
      <div class="row">
        <div class="col s4 card blue" v-for="list in lists" :key="list.id">
          <div class="card-content">
            <span class="card-title">{{ list.name }}</span>
            <p>{{ list.description }}</p>
          </div>
          <div class="card-action">
            <router-link class="white-text" :to="{ name: 'list', params: { id: list.id } }"
              >To List</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from '@/store';
import Navigation from '@/components/Navigation.vue';

export default {
  components: {
    Navigation,
  },
  setup() {
    const lists = mapState('lists');

    return { lists };
  },
};
</script>
