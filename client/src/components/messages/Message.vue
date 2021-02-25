<template>
  <div v-if="dismissed === false" class="flex gap-4 items-center border-t-4 p-4 my-2 rounded-sm">
    <slot />
    <button
      v-if="typeof onDismiss === 'function'"
      class="w-3 text-gray-500 hover:text-gray-600 ml-auto"
      @click="onDismiss"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 352 512"
      >
        <path
          fill="currentColor"
          d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19
          0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48
          0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48
          0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28
          256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24
          22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07
          100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28
          12.28-32.19 0-44.48L242.72 256z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    dismissed: {
      type: Boolean,
      required: true,
    },
    onDismiss: {
      type: Function,
      required: true,
    },
  },
};
</script>
