<template>
  <li class="pb-2 border-b border-gray-400">
    <span v-if="event?.emitter">{{ event.emitter.username }}</span> {{ typeForDisplay(event.type) }}
    {{ serviceForDisplay(event.service) }}
    <span v-if="event.description" class="block text-sm">{{ event.description }}</span>
    <small class="block text-gray-600">{{ formatDate(event.created_at) }}</small>
  </li>
</template>
<script>
import { formatDate } from '@/helpers';

export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup() {
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
        case 'COMPLETE':
          return 'completed';
        case 'UNCOMPLETE':
          return 'uncompleted';
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
      formatDate,
      typeForDisplay,
      serviceForDisplay,
    };
  },
};
</script>
