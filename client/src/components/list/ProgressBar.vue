<template>
  <div class="section progress-wrapper valign-wrapper">
    <div class="progress white">
      <div class="determinate red lighten-3" :style="{ width: `${percentage}%` }"></div>
    </div>
    <span class="white-text">{{ percentage }}%</span>
  </div>
</template>
<script>
import { computed } from 'vue';

export default {
  props: {
    items: Array,
  },
  setup(props) {
    // Calculate the percentage of the items with done == true
    const percentage = computed(() => {
      // Handle NaN
      if (props.items.length < 1) {
        return 100;
      }

      const completed = props.items.filter((item) => item.done).length;
      return ((completed / props.items.length) * 100).toFixed(0);
    });

    return {
      percentage,
    };
  },
};
</script>
<style lang="scss" scoped>
.progress-wrapper {
  display: flex;
  margin: 0 1.5rem;

  .progress {
    margin: 0 1rem 0 0;
  }

  > span {
    font-size: 90%;
  }
}
</style>
