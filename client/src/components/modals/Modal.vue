<template>
  <div class="fixed inset-0 z-10">
    <div class="grid min-h-screen place-items-center">
      <div class="fixed inset-0" aria-hidden="true">
        <div @click="onClickOutside" class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div
        class="transform bg-white rounded-lg shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="px-4 pt-5 pb-4" style="min-width: 40vw;">
          <h3 class="text-lg border-b" id="modal-headline">
            <slot name="header" />
          </h3>
          <div class="mt-2">
            <slot />
          </div>
        </div>
        <div class="flex gap-2 px-4 py-3 border-t">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onClickOutside: {
      type: Function,
      required: false,
    },
  },
};
</script>
