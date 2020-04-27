<template>
  <div class="flex" :title="tooltip">
    <i class="material-icons assistive-icon">{{ icon }}</i>
    <div class="flex column">
      <p class="m-0 item-user">{{ user }}</p>
      <p class="m-0 item-date">{{ new Date( date ).toLocaleString() }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    date: {
      required: true,
    },
    user: String,
    icon: String,
    tooltip: String,
  },
};
</script>
<style lang="scss" scoped>
.item-date {
  font-size: 80%;
}

.item-user {
  font-size: 90%;
}

.assistive-icon {
  opacity: 0.5;
  font-size: 1.5rem;
  margin-right: 0.5rem;
}
</style>
