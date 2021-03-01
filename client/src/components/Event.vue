<template>
  <li class="pb-2 border-b border-gray-400">
    <span v-if="emitter">{{ emitter.username }}</span> {{ typeForDisplay(event.type) }}
    {{ serviceForDisplay(event.service) }}
    <small class="block text-gray-600">{{ formatDate(event.created_at) }}</small>
  </li>
</template>
<script>
import { onMounted, ref } from 'vue';
import { models } from '@feathersjs/vuex';

import { formatDate } from '@/helpers';

export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { User } = models.api;

    const emitter = ref(null);
    onMounted(async () => {
      emitter.value = await User.get(props.event.emitter_id).catch(console.error);
    });

    function typeForDisplay(type) {
      switch (type) {
        case 'CREATE':
          return 'created';
        case 'READ':
          return 'looked at';
        case 'UPDATE':
          return 'made changes to';
        case 'DELETE':
          return 'removed';
        default:
          return type;
      }
    }

    function serviceForDisplay(service) {
      switch (service) {
        case 'todo-lists':
          return 'the todo list';
        case 'todos':
          return 'an item';
        case 'user-has-access':
          return 'the people with access';
        case 'users':
          return 'a user';
        default:
          return service;
      }
    }

    return {
      emitter,
      formatDate,
      typeForDisplay,
      serviceForDisplay,
    };
  },
};
</script>
