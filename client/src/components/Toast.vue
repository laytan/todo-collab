<template>
  <span class="screen-readers">
    {{ message }}
  </span>
</template>
<script>
import { onMounted } from 'vue';

export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    time: Number,
    classes: String,
  },
  setup(props) {
    onMounted(() => {
      window.M.toast({
        displayTime: props.time,
        classes: props.classes,
        html: props.message,
      });
    });
  },
};
</script>

<style lang="scss" scoped>
// Screen readers still read this
.screen-readers {
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
}
</style>
