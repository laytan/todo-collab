<template>
  <Message :dismissed="dismissed" :on-dismiss="onDismiss" class="bg-green-100 border-green-600">
    <slot />
  </Message>
</template>

<script>
import Message from './Message.vue';

export default {
  components: {
    Message,
  },
  props: {
    dismissed: {
      type: Boolean,
      required: false,
    },
    onDismiss: {
      type: Function,
      required: false,
    },
  },
};
</script>
