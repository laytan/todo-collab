<template>
  <ul v-if="errors.length" class="p-2 mb-2 bg-red-100 rounded-md">
    <li v-for="error in errors" :key="error" class="text-red-600">
      {{ error }}
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
    fallback: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const errors = computed(() => {
      if (Object.keys(props.error).length) {
        if (props.error.errors?.length && Object.keys(props.error.errors[0])?.length) {
          return props.error.errors.flatMap((v) => Object.values(v));
        }
        return [props.fallback || 'Something went wrong, please try again'];
      }
      return [];
    });

    return { errors };
  },
};
</script>
